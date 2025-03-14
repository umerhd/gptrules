import { PopupManager } from "./PopupManager";
import { ContentEditableHandler } from "./ContentEditableHandler";
import { TextAreaHandler } from "./TextAreaHandler";
import { Rule } from "../types";

export class RulesInjector {
  private rules: Rule[] = [];
  private popupManager: PopupManager;
  private contentEditableHandler: ContentEditableHandler;
  private textAreaHandler: TextAreaHandler;

  constructor() {
    this.popupManager = new PopupManager();
    this.contentEditableHandler = new ContentEditableHandler(this.popupManager);
    this.textAreaHandler = new TextAreaHandler(this.popupManager);

    this.loadRules();
    this.setupListeners();
    this.setupMutationObserver();
  }

  private loadRules() {
    chrome.runtime.sendMessage({ type: "GET_RULES" }, (response) => {
      this.rules = response || [];
      this.popupManager.setRules(this.rules);
    });
  }

  private setupListeners() {
    const contentEditableDivs = document.querySelectorAll(
      "[contenteditable='true']"
    );
    const textAreas = document.querySelectorAll("textarea");

    if (contentEditableDivs.length > 0) {
      contentEditableDivs.forEach((div) => {
        this.contentEditableHandler.addEventListeners(div as HTMLElement);
      });
    } else {
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
              if (node.getAttribute("contenteditable") === "true") {
                this.contentEditableHandler.addEventListeners(node);
              }
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
