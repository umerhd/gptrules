import "./content.css";
import { Rule, RuleSet } from "../types";

console.log("Content script loaded");

class RulesInjector {
  private activeRuleSet: RuleSet | null = null;
  private popup: HTMLElement | null = null;

  constructor() {
    console.log("RulesInjector initialized");
    this.loadActiveRuleSet();
    this.createPopup();
    this.setupListeners();
  }

  private async loadActiveRuleSet() {
    console.log("Loading active rule set");
    try {
      // Load rules from chrome.storage
      const result = await chrome.storage.sync.get("activeRuleSet");
      console.log("Loaded active rule set:", result);
      this.activeRuleSet = result.activeRuleSet || null;
    } catch (error) {
      console.error("Error loading active rule set:", error);
    }
  }

  private createPopup() {
    this.popup = document.createElement("div");
    this.popup.id = "rules-popup";
    this.popup.style.position = "absolute";
    this.popup.style.display = "none";
    this.popup.style.border = "1px solid #ccc";
    this.popup.style.backgroundColor = "#fff";
    this.popup.style.zIndex = "1000";
    document.body.appendChild(this.popup);
  }

  private setupListeners() {
    const contentEditableDiv = document.getElementById("prompt-textarea");
    const textAreas = document.querySelectorAll("textarea");

    if (contentEditableDiv) {
      contentEditableDiv.addEventListener("input", () => {
        this.handleContentEditableInput(contentEditableDiv);
      });
    }

    textAreas.forEach((textArea) => {
      textArea.addEventListener("input", () => {
        this.handleTextAreaInput(textArea as HTMLTextAreaElement);
      });
    });
  }

  private handleContentEditableInput(contentEditableDiv: HTMLElement) {
    const textContent = contentEditableDiv.textContent || "";
    const match = textContent.match(/@@(\w*)$/);

    if (match) {
      this.showPopup(contentEditableDiv, match[1]);
    } else {
      this.hidePopup();
    }
  }

  private handleTextAreaInput(textArea: HTMLTextAreaElement) {
    const cursorPosition = textArea.selectionStart;
    const textBeforeCursor = textArea.value.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/@@(\w*)$/);

    if (match) {
      this.showPopup(textArea, match[1]);
    } else {
      this.hidePopup();
    }
  }

  private showPopup(targetElement: HTMLElement, filter: string) {
    if (!this.activeRuleSet || !this.popup) return;

    const filteredRules = this.activeRuleSet.rules.filter((rule) =>
      rule.name.startsWith(filter)
    );

    this.popup.innerHTML = filteredRules
      .map(
        (rule) =>
          `<div class="rule-item" data-rule="${rule.name}">${rule.name}</div>`
      )
      .join("");

    this.popup.style.display = "block";
    const rect = targetElement.getBoundingClientRect();
    this.popup.style.left = `${rect.left + window.scrollX}px`;
    this.popup.style.top = `${rect.bottom + window.scrollY}px`;

    this.popup.querySelectorAll(".rule-item").forEach((item) => {
      item.addEventListener("click", () => {
        const ruleName = item.getAttribute("data-rule");
        const rule = this.activeRuleSet?.rules.find((r) => r.name === ruleName);
        if (rule) {
          this.insertRuleContent(targetElement, rule.description);
        }
        this.hidePopup();
      });
    });
  }

  private hidePopup() {
    if (this.popup) {
      this.popup.style.display = "none";
    }
  }

  private insertRuleContent(targetElement: HTMLElement, content: string) {
    if (targetElement instanceof HTMLTextAreaElement) {
      const cursorPosition = targetElement.selectionStart;
      const textBeforeCursor = targetElement.value.substring(0, cursorPosition);
      const textAfterCursor = targetElement.value.substring(cursorPosition);
      targetElement.value =
        textBeforeCursor.replace(/@@\w*$/, content) + textAfterCursor;
      targetElement.setSelectionRange(cursorPosition, cursorPosition);
    } else {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(content));

      // Move the cursor to the end of the inserted content
      range.setStartAfter(range.endContainer);
      range.setEndAfter(range.endContainer);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

// Initialize the injector when the content script loads
console.log("Creating RulesInjector instance");
new RulesInjector();
