import { OptedState } from "../model/optionItemState";

declare module "@ckeditor/ckeditor5-core" { // augment module to avoid TypeScript errors
    interface EditorConfig {
        bracketOption?: {
            bracketOptionRenderer: (
                id: string,
                value: string,
                optedState: OptedState,
                isEditable: boolean,
                onOptedStateChanged: (newState: OptedState) => void,
                domElement: HTMLElement,
            ) => void;
        },
        cloudServices?: {
            tokenUrl: string,
            webSocketUrl: string
        },
        presenceList?: {
            container: HTMLElement | null,
        },
    }
}