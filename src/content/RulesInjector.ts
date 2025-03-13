import { PopupManager } from "./PopupManager";
import { ContentEditableHandler } from "./ContentEditableHandler";
import { TextAreaHandler } from "./TextAreaHandler";
import { RuleSet } from "../types";

export class RulesInjector {
  private activeRuleSet: RuleSet | null = null;
  private popupManager: PopupManager;
  private contentEditableHandler: ContentEditableHandler;
  private textAreaHandler: TextAreaHandler;

  constructor() {
    this.popupManager = new PopupManager();
    this.contentEditableHandler = new ContentEditableHandler(this.popupManager);
    this.textAreaHandler = new TextAreaHandler(this.popupManager);

    this.loadActiveRuleSet();
    this.setupListeners();
    this.setupMutationObserver();
  }

  private async loadActiveRuleSet() {
    try {
      const result = await chrome.storage.sync.get("activeRuleSet");
      this.activeRuleSet = result.activeRuleSet || null;
      this.popupManager.setRuleSet(this.activeRuleSet);
    } catch (error) {}
  }

  private setupListeners() {
    // Find all contenteditable elements
    const contentEditableDivs = document.querySelectorAll(
      "[contenteditable='true']"
    );
    const textAreas = document.querySelectorAll("textarea");

    if (contentEditableDivs.length > 0) {
      contentEditableDivs.forEach((div) => {
        this.contentEditableHandler.addEventListeners(div as HTMLElement);
      });
    } else {
      // Retry after a short delay
      setTimeout(() => this.setupListeners(), 1000);
    }

    textAreas.forEach((textArea) => {
      this.textAreaHandler.addEventListeners(textArea as HTMLTextAreaElement);
    });
  }

  private setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          for (const node of addedNodes) {
            if (node instanceof HTMLElement) {
              // Check if the added node is a contenteditable element
              if (node.getAttribute("contenteditable") === "true") {
                this.contentEditableHandler.addEventListeners(node);
              }
              // Check if the added node contains contenteditable elements
              const contentEditables = node.querySelectorAll(
                "[contenteditable='true']"
              );
              if (contentEditables.length > 0) {
                contentEditables.forEach((div) => {
                  this.contentEditableHandler.addEventListeners(
                    div as HTMLElement
                  );
                });
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}
