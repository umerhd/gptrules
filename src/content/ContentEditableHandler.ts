import { PopupManager } from "./PopupManager";

export class ContentEditableHandler {
  private popupManager: PopupManager;

  constructor(popupManager: PopupManager) {
    this.popupManager = popupManager;
  }

  public addEventListeners(element: HTMLElement) {
    element.addEventListener("input", () => {
      this.handleInput(element);
    });
    element.addEventListener("keyup", () => {
      this.handleInput(element);
    });
  }

  private handleInput(element: HTMLElement) {
    const textContent = element.innerText || "";
    const match = textContent.match(/#(\w*)$/); // Use # as the trigger

    if (match) {
      this.popupManager.showPopup(element, match[1], (content) => {
        this.insertContent(element, content);
      });
    } else {
      this.popupManager.hidePopup();
    }
  }

  private insertContent(element: HTMLElement, content: string) {
    try {
      // Get the current text content
      const textContent = element.innerText;

      // Find the # pattern
      const match = textContent.match(/#\w*$/);
      if (!match) {
        return;
      }

      // Replace the entire content with the new content
      const newContent = textContent.replace(/#\w*$/, content);
      element.innerText = newContent;

      // Focus the contenteditable element
      element.focus();

      // Place the cursor at the end of the content
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      const textNode = element.firstChild;

      if (textNode) {
        try {
          // Try to place the cursor at the end of the text node
          range.setStart(textNode, newContent.length);
          range.setEnd(textNode, newContent.length);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          // If setting the cursor position fails, just focus the element
          element.focus();
        }
      } else {
        // If there's no text node, just focus the element
        element.focus();
      }
    } catch (error) {
      // Fallback method: replace the entire content
      const newContent = element.innerText.replace(/#\w*$/, content);
      element.innerText = newContent;

      // Focus the contenteditable element
      element.focus();
    }
  }
}
