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
    this.setupMutationObserver();
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
    // Find all contenteditable elements
    const contentEditableDivs = document.querySelectorAll(
      "[contenteditable='true']"
    );
    const textAreas = document.querySelectorAll("textarea");

    if (contentEditableDivs.length > 0) {
      console.log(
        `Found ${contentEditableDivs.length} contenteditable elements`
      );
      contentEditableDivs.forEach((div) => {
        console.log("Adding event listeners to contenteditable element:", div);
        div.addEventListener("input", () => {
          console.log("Input event triggered");
          this.handleContentEditableInput(div as HTMLElement);
        });
        div.addEventListener("keyup", () => {
          console.log("Keyup event triggered");
          this.handleContentEditableInput(div as HTMLElement);
        });
      });
    } else {
      console.error("No contenteditable elements found");
      // Retry after a short delay
      setTimeout(() => this.setupListeners(), 1000);
    }

    textAreas.forEach((textArea) => {
      textArea.addEventListener("input", () => {
        this.handleTextAreaInput(textArea as HTMLTextAreaElement);
      });
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
                console.log("Contenteditable element added to DOM:", node);
                this.addEventListenersToContentEditable(node);
              }
              // Check if the added node contains contenteditable elements
              const contentEditables = node.querySelectorAll(
                "[contenteditable='true']"
              );
              if (contentEditables.length > 0) {
                console.log(
                  `Found ${contentEditables.length} contenteditable elements in added node`
                );
                contentEditables.forEach((div) => {
                  this.addEventListenersToContentEditable(div as HTMLElement);
                });
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private addEventListenersToContentEditable(element: HTMLElement) {
    console.log("Adding event listeners to contenteditable element:", element);
    element.addEventListener("input", () => {
      console.log("Input event triggered");
      this.handleContentEditableInput(element);
    });
    element.addEventListener("keyup", () => {
      console.log("Keyup event triggered");
      this.handleContentEditableInput(element);
    });
  }

  private handleContentEditableInput(contentEditableDiv: HTMLElement) {
    const textContent = contentEditableDiv.innerText || "";
    console.log("ContentEditable Text:", textContent);
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
    console.log("TextArea Text Before Cursor:", textBeforeCursor);
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
    console.log("Inserting rule content:", content);

    if (targetElement instanceof HTMLTextAreaElement) {
      // Handle textarea
      console.log("Inserting into textarea");
      const textarea = targetElement;
      const cursorPosition = textarea.selectionStart || 0;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(cursorPosition);

      console.log("Text before cursor:", textBeforeCursor);
      console.log("Text after cursor:", textAfterCursor);

      // Find the @@ pattern in the text before cursor
      const match = textBeforeCursor.match(/@@\w*$/);
      if (!match) {
        console.error("@@ pattern not found in text before cursor");
        return;
      }

      // Calculate the start position of the @@ pattern
      const patternStartPos = textBeforeCursor.lastIndexOf(match[0]);

      // Replace the @@ pattern with the rule content
      const newTextBeforeCursor =
        textBeforeCursor.substring(0, patternStartPos) + content;

      // Set the new value of the textarea
      textarea.value = newTextBeforeCursor + textAfterCursor;

      // Set the cursor position after the inserted content
      const newCursorPosition = newTextBeforeCursor.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();

      console.log("New text:", textarea.value);
      console.log("New cursor position:", newCursorPosition);
    } else {
      // Handle contenteditable
      try {
        console.log("Inserting into contenteditable");

        // Use the execCommand approach for contenteditable elements
        // This is more reliable than manipulating ranges directly
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) {
          console.error("No selection found");
          return;
        }

        // Get the current text content
        const textContent = targetElement.innerText;
        console.log("Current text content:", textContent);

        // Find the @@ pattern
        const match = textContent.match(/@@\w*$/);
        if (!match) {
          console.error("@@ pattern not found in text content");
          return;
        }

        // Replace the entire content with the new content
        // This is a more reliable approach than manipulating ranges
        const newContent = textContent.replace(/@@\w*$/, content);
        targetElement.innerText = newContent;

        // Focus the contenteditable element
        targetElement.focus();

        // Place the cursor at the end of the content
        const range = document.createRange();
        const textNode = targetElement.firstChild;

        if (textNode) {
          try {
            // Try to place the cursor at the end of the text node
            range.setStart(textNode, newContent.length);
            range.setEnd(textNode, newContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (error) {
            console.error("Error setting cursor position:", error);
            // If setting the cursor position fails, just focus the element
            targetElement.focus();
          }
        } else {
          // If there's no text node, just focus the element
          targetElement.focus();
        }
      } catch (error) {
        console.error("Error inserting rule content:", error);

        // Fallback method: replace the entire content
        const newContent = targetElement.innerText.replace(/@@\w*$/, content);
        targetElement.innerText = newContent;

        // Focus the contenteditable element
        targetElement.focus();
      }
    }
  }
}

// Initialize the injector when the content script loads
console.log("Creating RulesInjector instance");
new RulesInjector();
