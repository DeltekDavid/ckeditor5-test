import { OptionItemState, TextContentElement } from "@deltek/specification-client/core/Models/textContentElement";

/**
 * Converts an array of text content elements to an HTML paragraph suitable for loading into CKEditor.
 * @param textContentElements - The array of text content elements.
 * @returns The string representing the editor paragraph.
 */
export const elementsToEditorParagraph = (textContentElements: Partial<TextContentElement>[] | undefined): string => {
    return `<p>${elementsToEditorData(textContentElements)}</p>`
}

/**
 * Converts a text content element to a string representing editor data.
 * @param textContentElement - The text content element.
 * @param isInsideOptionItem - Indicates if the element is inside an option item.
 * @param optionGroupId - The ID of the option group we are in, if any.
 * @returns The string representing the editor data.
 */
const elementToEditorData = (textContentElement: Partial<TextContentElement>, isInsideOptionItem?: boolean, optionGroupId?: string): string => {
    if (!textContentElement) {
        return "";
    }

    const optionGroupIdAttribute = optionGroupId ? ` data-option-group-id='${optionGroupId}'` : "";

    switch (textContentElement.type) {
        case "Text":
            return textContentElement.text ? `<span class='paragraph-text' data-id='${textContentElement.id}'${optionGroupIdAttribute}>${textContentElement.text}</span>` : "";
        case "Hyperlink":
            return `<a href='${textContentElement.hyperlinkUrl}' data-id='${textContentElement.id}'${optionGroupIdAttribute}>${textContentElement.text}</a>`;
        case "UnitsOfMeasure":
            return `<span class='${isInsideOptionItem ? 'nested-units-of-measure' : 'units-of-measure'}' data-id='${textContentElement.id}'${optionGroupIdAttribute}><span class='imperial'>${textContentElement.imperialUnits}</span><span class='metric'>${textContentElement.metricUnits}</span></span>`;
        case "OptionGroup":
            return elementsToEditorData(textContentElement.elements, false, textContentElement.id);
        case "SelectionOption":
            return `<span class='bracket-option' data-id='${textContentElement.id}'${optionGroupIdAttribute} data-opted-state='${getOptedState(textContentElement.optionItemState)}' data-editable='false'>${textContentElement.text}${elementsToEditorData(textContentElement.elements, true)}</span>`;
        case "ReplacementOption":
            return `<span class='bracket-option' data-id='${textContentElement.id}'${optionGroupIdAttribute} data-opted-state='${getOptedState(textContentElement.optionItemState)}' data-editable='true'>${textContentElement.text}</span>`;
        default:
            return "";
    }
}

/**
 * Converts an array of text content elements to a string representing editor data.
 * @param textContentElements - The array of text content elements.
 * @param isInsideOptionItem - Indicates if the elements are inside an option item.
 * @param optionGroupId - The ID of the option group we are in, if any.
 * @returns The string representing the editor data.
 */
const elementsToEditorData = (textContentElements: Partial<TextContentElement>[] | undefined, isInsideOptionItem?: boolean, optionGroupId?: string): string => {
    return textContentElements ? textContentElements.map(el => elementToEditorData(el, isInsideOptionItem, optionGroupId)).join("") : "";
}

/**
 * Gets the opted state as a string based on the option item state.
 * @param optionItemState - The option item state.
 * @returns The string representing the opted state.
 */
const getOptedState = (optionItemState: OptionItemState | null | undefined): string => {
    switch (optionItemState) {
        case "OptedIn":
            return "OPTED_IN";
        case "OptedOut":
            return "OPTED_OUT";
        case "InActive":
            return "OPTED_OUT"; // TODO: determine if this is correct
        default:
            return "UNDECIDED";
    }
}
