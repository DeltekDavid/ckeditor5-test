import { OptionItemState, TextContentElement } from "@deltek/specification-client/core/Models/textContentElement";

/**
 * Represents a tracked change (e.g., insertion or deletion).
 * See https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#loading-the-data
 */
export interface TrackChangeSuggestion {
    id: string;
    type: string;
    authorId: string;
    createdAt: Date;
}

/**
 * Converts an array of text content elements to a string representing editor data.
 * @param textContentElements - The array of text content elements.
 * @param isInsideOptionItem - Indicates if the elements are inside an option item.
 * @param optionGroupId - The ID of the option group we are in, if any.
 * @returns The string representing the editor data.
 */
export const elementsToEditorData = (textContentElements: Partial<TextContentElement>[] | undefined, isInsideOptionItem?: boolean, optionGroupId?: string): string => {
    return textContentElements ? textContentElements.map(el => elementToEditorData(el, isInsideOptionItem, optionGroupId)).join("") : "";
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
            const suggestionName = getSuggestionName(textContentElement);
            const startChangeTag = suggestionName ? `<suggestion-start name='${suggestionName}'></suggestion-start>` : "";
            const endChangeTag = suggestionName ? `<suggestion-end name='${suggestionName}'></suggestion-end>` : "";
            return textContentElement.text ? `<span class='paragraph-text' data-id='${textContentElement.id}'${optionGroupIdAttribute}>${startChangeTag}${textContentElement.text}${endChangeTag}</span>` : "";
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
 * Gets the name attribute to assign to a suggestion tag for loading into CKEditor.
 * @param textContentElement - The text content element.
 * @returns The name attribute for the suggestion tag or an empty string if no suggestion is needed. 
 */
const getSuggestionName = (textContentElement: Partial<TextContentElement>): string => {
    const suggestionType = getSuggestionType(textContentElement.changeType);
    return suggestionType ? `${suggestionType}:${textContentElement.id}:${textContentElement.authoredUserId}` : "";
}

/** 
 * Converts our change type to the suggestion type expected by CKEditor.
 */
const getSuggestionType = (changeType: string | null | undefined): string => {
    switch (changeType?.toUpperCase()) {
        case "ADDED":
            return "insertion";
        case "DELETED":
            return "deletion";
        default:
            return "";
    }
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

/**
 * Extracts track change suggestions from an array of text content elements.
 * @param textContentElements - The array of text content elements to extract suggestions from.
 * @returns An array of track change suggestions for CKEditor.
 */
export const extractSuggestions = (textContentElements: Partial<TextContentElement>[] | undefined): TrackChangeSuggestion[] => {
    return textContentElements ? textContentElements
        .filter(el => el.changeType?.toUpperCase() === "ADDED" || el.changeType?.toUpperCase() === "DELETED")
        .map(el => ({
            id: el.id ?? "",
            type: getSuggestionType(el.changeType),
            authorId: el.authoredUserId ?? "",
            createdAt: new Date(),
        })) : [];
}


/**
 * Converts editor data to an array of text content elements.
 * @param editorData - The editor data to convert.
 * @returns An array of text content elements.
 */
export const editorDataToElements = (editorData: string): Partial<TextContentElement>[] => {
    const elements: Partial<TextContentElement>[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorData, "text/html");
    const paragraph = doc.querySelector("p");
    if (!paragraph) {
        return elements;
    }

    const childNodes = paragraph.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        const textElement = convertNodeToElement(node);
        if (textElement) {
            elements.push(textElement);
        }
    }

    return elements;
}

export const convertNodeToElement = (node: Node): Partial<TextContentElement> | null => {
    const htmlElement = node as HTMLElement;
    if (!htmlElement) {
        return null;
    }

    const dataId = htmlElement.getAttribute("data-id");
    const textElement = createTextContentElement();
    textElement.id = dataId || "";
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "SPAN") {
        if (htmlElement.className === "paragraph-text") {
            textElement.text = htmlElement.textContent || "";
            return textElement;
        } else if (htmlElement.className === "units-of-measure" || htmlElement.className === "nested-units-of-measure") {
            const unitsOfMeasure = htmlElement.children;
            textElement.type = "UnitsOfMeasure";
            textElement.imperialUnits = unitsOfMeasure[0].textContent || "";
            textElement.metricUnits = unitsOfMeasure[1].textContent || "";
            return textElement;
        } else if (htmlElement.className === "bracket-option") {
            const optedState = htmlElement.getAttribute("data-opted-state");
            const isEditable = htmlElement.getAttribute("data-editable") === "true";
            textElement.type = isEditable ? "ReplacementOption" : "SelectionOption";
            textElement.text = htmlElement.textContent || "";
            textElement.isOptionItem = true;
            textElement.optionItemState = getOptionItemState(optedState);
            return textElement
        }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "A") {
        const a = node as HTMLAnchorElement;
        textElement.type = "Hyperlink";
        textElement.text = a.textContent || "";
        textElement.hyperlinkUrl = a.href.replace(/\/$/, ""); // Remove trailing slash that DOMParser adds for some reason
        return textElement;
    }

    return null;
}

const createTextContentElement = (): TextContentElement => {
    return {
        id: "",
        type: "Text",
        text: "",
        isOptionItem: false,
        imperialUnits: "",
        metricUnits: "",
        fieldId: "",
        elements: [],
        optionItemState: null,
        hyperlinkUrl: "",
        placeholderText: "",
        changeType: null,
        authoredUserId: "",
    };
}

const getOptionItemState = (optedState: string | null): OptionItemState => {
    switch (optedState) {
        case "OPTED_IN":
            return "OptedIn";
        case "OPTED_OUT":
            return "OptedOut";
        case "UNDECIDED":
            return null;
        default:
            return null;
    }
}

