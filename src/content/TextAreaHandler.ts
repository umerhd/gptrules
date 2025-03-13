import { PopupManager } from "./PopupManager";

export class TextAreaHandler {
  private popupManager: PopupManager;

  constructor(popupManager: PopupManager) {
    this.popupManager = popupManager;
  }

  public addEventListeners(element: HTMLTextAreaElement) {
    element.addEventListener("input", () => {
      this.handleInput(element);
    });
  }

  private handleInput(element: HTMLTextAreaElement) {
    const cursorPosition = element.selectionStart;
    const textBeforeCursor = element.value.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/@@(\w*)$/); // Use @@ to avoid conflicts

    if (match) {
      this.popupManager.showPopup(element, match[1], (content) => {
        this.insertContent(element, content);
      });
    } else {
      this.popupManager.hidePopup();
    }
  }

  private insertContent(element: HTMLTextAreaElement, content: string) {
    const cursorPosition = element.selectionStart || 0;
    const textBeforeCursor = element.value.substring(0, cursorPosition);
    const textAfterCursor = element.value.substring(cursorPosition);

    // Find the @@ pattern in the text before cursor
    const match = textBeforeCursor.match(/@@\w*$/);
    if (!match) {
      return;
    }

    // Calculate the start position of the @@ pattern
    const patternStartPos = textBeforeCursor.lastIndexOf(match[0]);

    // Replace the @@ pattern with the rule content
    const newTextBeforeCursor =
      textBeforeCursor.substring(0, patternStartPos) + content;

    // Set the new value of the textarea
    element.value = newTextBeforeCursor + textAfterCursor;

    // Set the cursor position after the inserted content
    const newCursorPosition = newTextBeforeCursor.length;
    element.setSelectionRange(newCursorPosition, newCursorPosition);
    element.focus();
  }
}
