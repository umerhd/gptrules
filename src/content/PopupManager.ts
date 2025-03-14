import { Rule } from "../types";
import React from "react";
import ReactDOM from "react-dom";
import RulesPopup from "./RulesPopup";

export class PopupManager {
  private popupContainer: HTMLElement | null = null;
  private rules: Rule[] = [];

  constructor() {
    this.createPopupContainer();
  }

  public setRules(rules: Rule[]) {
    this.rules = rules;
  }

  private createPopupContainer() {
    // Remove existing container if it exists
    const existingContainer = document.getElementById("rules-popup-container");
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }

    // Create new container with high z-index
    this.popupContainer = document.createElement("div");
    this.popupContainer.id = "rules-popup-container";
    this.popupContainer.style.position = "fixed";
    this.popupContainer.style.zIndex = "99999"; // Very high z-index
    this.popupContainer.style.pointerEvents = "auto";

    // Append to body
    document.body.appendChild(this.popupContainer);
  }

  public showPopup(
    targetElement: HTMLElement,
    filter: string,
    insertCallback: (content: string) => void
  ) {
    if (!this.rules.length || !this.popupContainer) return;

    const filteredRules = this.rules.filter((rule) =>
      rule.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredRules.length === 0) {
      this.hidePopup();
      return;
    }

    // Get position relative to viewport
    const rect = targetElement.getBoundingClientRect();

    // Calculate position to ensure popup is visible
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Default position below the input
    let top = `${rect.bottom + 5}px`;
    let left = `${rect.left}px`;

    // If too close to bottom of viewport, position above
    if (rect.bottom + 200 > viewportHeight) {
      top = `${rect.top - 210}px`;
    }

    // If too close to right edge, align right edge of popup with right edge of input
    if (rect.left + 300 > viewportWidth) {
      left = `${Math.max(10, rect.right - 300)}px`;
    }

    const position = { left, top };

    ReactDOM.render(
      React.createElement(RulesPopup, {
        rules: filteredRules,
        position: position,
        onRuleSelect: (rule) => {
          insertCallback(rule.content);
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
