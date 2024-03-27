import { OptedState } from "../model/optionItemState";

declare module "@ckeditor/ckeditor5-core" {
    interface EditorConfig {
        bracketOption?: {
            bracketOptionRenderer: (
                id: string,
                value: string,
                optedState: OptedState,
                onOptedStateChanged: (newState: OptedState) => void,
                domElement: HTMLElement,
            )=> void;
        },
        cloudServices: {
            tokenUrl: string,
            webSocketUrl: string
        },
    }
  }