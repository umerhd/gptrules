import { Rule, RuleSet } from "../types";

class RulesInjector {
  private container: HTMLElement | null = null;
  private activeRuleSet: RuleSet | null = null;

  constructor() {
    this.initializeUI();
    this.loadActiveRuleSet();
  }

  private initializeUI() {
    // Create floating button
    const button = document.createElement("button");
    button.id = "ai-rules-toggle";
    button.innerHTML = "📋 Rules";
    button.onclick = () => this.toggleRulesPanel();
    document.body.appendChild(button);
  }

  private async loadActiveRuleSet() {
    // Load rules from chrome.storage
    const result = await chrome.storage.sync.get("activeRuleSet");
    this.activeRuleSet = result.activeRuleSet || null;
  }

  private toggleRulesPanel() {
    if (this.container?.style.display === "none") {
      this.showRulesPanel();
    } else {
      this.hideRulesPanel();
    }
  }

  private showRulesPanel() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "ai-rules-container";
      this.renderRules();
      document.body.appendChild(this.container);
    }
    this.container.style.display = "block";
  }

  private hideRulesPanel() {
    if (this.container) {
      this.container.style.display = "none";
    }
  }

  private renderRules() {
    if (!this.container || !this.activeRuleSet) return;

    this.container.innerHTML = `
      <h3>${this.activeRuleSet.name}</h3>
      <div class="rules-list">
        ${this.activeRuleSet.rules
          .map(
            (rule) => `
            <div class="rule-item">
              <h4>${rule.name}</h4>
              <p>${rule.description}</p>
              <button onclick="copyRule('${rule.id}')" class="copy-btn">
                Copy to Clipboard
              </button>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }
}

// Initialize the injector when the content script loads
new RulesInjector();
