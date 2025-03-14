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
        // Handle rule update
        (async () => {
          try {
            await handleRuleUpdate(message.rule, sendResponse);
          } catch (error) {
            console.error("Error in UPDATE_RULE handler:", error);
            sendResponse({ success: false, error });
          }
        })();
        return true;

      case "DELETE_RULE":
        // Handle rule deletion
        (async () => {
          try {
            await handleRuleDelete(message.ruleId, sendResponse);
          } catch (error) {
            console.error("Error in DELETE_RULE handler:", error);
            sendResponse({ success: false, error });
          }
        })();
        return true;

      case "ADD_RULE":
        // Handle rule addition
        (async () => {
          try {
            await handleRuleAdd(message.rule, sendResponse);
          } catch (error) {
            console.error("Error in ADD_RULE handler:", error);
            sendResponse({ success: false, error });
          }
        })();
        return true;

      case "APPLY_RULES":
        applyRulesToChat(sender.tab?.id);
        return true;

      default:
    }
  } catch (error) {
    console.error("Error handling message:", error);
    sendResponse({ success: false, error });
  }
  return true;
});

async function handleRuleUpdate(
  updatedRule: Rule,
  sendResponse: (response?: any) => void
) {
  try {
    const { rules } = await chrome.storage.sync.get(["rules"]);

    if (!rules) return;

    const updatedRules = rules.map((rule: Rule) =>
      rule.id === updatedRule.id ? updatedRule : rule
    );

    await chrome.storage.sync.set({
      rules: updatedRules,
    });

    sendResponse({ success: true, rules: updatedRules });
  } catch (error) {
    sendResponse({ success: false, error });
  }
}

async function handleRuleDelete(
  ruleId: string,
  sendResponse: (response?: any) => void
) {
  try {
    const { rules } = await chrome.storage.sync.get(["rules"]);

    if (!rules) return;

    const updatedRules = rules.filter((rule: Rule) => rule.id !== ruleId);

    await chrome.storage.sync.set({
      rules: updatedRules,
    });

    sendResponse({ success: true, rules: updatedRules });
  } catch (error) {
    sendResponse({ success: false, error });
  }
}

async function handleRuleAdd(
  newRule: Rule,
  sendResponse: (response?: any) => void
) {
  try {
    // Get current rules
    const result = await chrome.storage.sync.get(["rules"]);

    // Create updated rules array
    const currentRules = Array.isArray(result.rules) ? result.rules : [];
    const updatedRules = [...currentRules, newRule];

    // Save updated rules
    await chrome.storage.sync.set({
      rules: updatedRules,
    });

    // Send response
    sendResponse({ success: true, rules: updatedRules });
  } catch (error) {
    console.error("Error adding rule:", error);
    sendResponse({ success: false, error: String(error) });
  }
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
