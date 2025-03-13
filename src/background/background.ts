import { Rule, RuleSet } from "../types";

// Initialize default rule set when extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  const defaultRuleSet: RuleSet = {
    id: crypto.randomUUID(),
    name: "Default Rules",
    rules: [
      {
        id: crypto.randomUUID(),
        name: "Professional Communication",
        description: "Maintain professional tone in responses",
        content:
          "Please maintain a professional and courteous tone in all responses. Use clear, concise language and avoid casual expressions.",
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        name: "Code Examples",
        description: "Include practical code examples",
        content:
          "When explaining technical concepts, please include practical code examples with comments explaining key parts.",
        isActive: true,
      },
    ],
  };

  await chrome.storage.sync.set({
    ruleSets: [defaultRuleSet],
    activeRuleSet: defaultRuleSet,
  });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
  }
});

async function handleRuleUpdate(updatedRule: Rule) {
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
