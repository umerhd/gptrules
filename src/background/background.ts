import { Rule, RuleSet } from "../types";
import { createDefaultRuleSet } from "./defaultRules";

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const defaultRuleSet = createDefaultRuleSet();

    await chrome.storage.sync.set({
      ruleSets: [defaultRuleSet],
      activeRuleSet: defaultRuleSet,
    });
  } catch (error) {}
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case "GET_ACTIVE_RULESET":
        chrome.storage.sync.get("activeRuleSet", (result) => {
          sendResponse(result.activeRuleSet);
        });
        return true; // Required for async response

      case "UPDATE_RULE":
        handleRuleUpdate(message.rule);
        return true;

      case "APPLY_RULES":
        applyRulesToChat(sender.tab?.id);
        return true;

      default:
    }
  } catch (error) {}
});

async function handleRuleUpdate(updatedRule: Rule) {
  try {
    const { ruleSets, activeRuleSet } = await chrome.storage.sync.get([
      "ruleSets",
      "activeRuleSet",
    ]);

    if (!activeRuleSet) return;

    const updatedRuleSet = {
      ...activeRuleSet,
      rules: activeRuleSet.rules.map((rule: Rule) =>
        rule.id === updatedRule.id ? updatedRule : rule
      ),
    };

    const updatedRuleSets = ruleSets.map((rs: RuleSet) =>
      rs.id === updatedRuleSet.id ? updatedRuleSet : rs
    );

    await chrome.storage.sync.set({
      ruleSets: updatedRuleSets,
      activeRuleSet: updatedRuleSet,
    });
  } catch (error) {}
}

async function applyRulesToChat(tabId?: number) {
  if (!tabId) return;

  const { activeRuleSet } = await chrome.storage.sync.get("activeRuleSet");
  if (!activeRuleSet) return;

  // Send active rules to content script
  chrome.tabs.sendMessage(tabId, {
    type: "RULES_UPDATE",
    rules: activeRuleSet.rules.filter((r: Rule) => r.isActive),
  });
}
