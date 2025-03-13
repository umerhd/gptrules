import { Rule, RuleSet } from "../types";
import React from "react";
import ReactDOM from "react-dom";
import RulesPopup from "./RulesPopup";

export class PopupManager {
  private popupContainer: HTMLElement | null = null;
  private activeRuleSet: RuleSet | null = null;

  constructor() {
    this.createPopupContainer();
  }

  public setRuleSet(ruleSet: RuleSet | null) {
    this.activeRuleSet = ruleSet;
  }

  private createPopupContainer() {
    this.popupContainer = document.createElement("div");
    this.popupContainer.id = "rules-popup-container";
    document.body.appendChild(this.popupContainer);
  }

  public showPopup(
    targetElement: HTMLElement,
    filter: string,
    insertCallback: (content: string) => void
  ) {
    if (!this.activeRuleSet || !this.popupContainer) return;

    const filteredRules = this.activeRuleSet.rules.filter((rule) =>
      rule.name.toLowerCase().includes(filter.toLowerCase())
    );

    const rect = targetElement.getBoundingClientRect();
    const position = {
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.bottom + window.scrollY}px`,
    };

    ReactDOM.render(
      React.createElement(RulesPopup, {
        rules: filteredRules,
        position: position,
        onRuleSelect: (rule) => {
          insertCallback(rule.description);
          this.hidePopup();
        },
        onClose: () => this.hidePopup(),
      }),
      this.popupContainer
    );
  }

  public hidePopup() {
    if (this.popupContainer) {
      ReactDOM.unmountComponentAtNode(this.popupContainer);
    }
  }
}
