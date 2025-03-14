import { Rule } from "../types";
import { defaultRules } from "./defaultRules";

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.storage.sync.set({
      rules: defaultRules,
    });
  } catch (error) {}
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case "GET_RULES":
        chrome.storage.sync.get("rules", (result) => {
          sendResponse(result.rules);
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
    const { rules } = await chrome.storage.sync.get(["rules"]);

    if (!rules) return;

    const updatedRules = rules.map((rule: Rule) =>
      rule.id === updatedRule.id ? updatedRule : rule
    );

    await chrome.storage.sync.set({
      rules: updatedRules,
    });
  } catch (error) {}
}

async function applyRulesToChat(tabId?: number) {
  if (!tabId) return;

  const { rules } = await chrome.storage.sync.get("rules");
  if (!rules || rules.length === 0) return;

  const activeRules = rules.filter((rule: Rule) => rule.isActive);

  // Send active rules to content script
  chrome.tabs.sendMessage(tabId, {
    type: "APPLY_RULES",
    rules: activeRules,
  });
}
