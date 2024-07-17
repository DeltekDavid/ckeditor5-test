import { TrackChangeSuggestion } from "./contentUtils";
import { BracketContentElement } from "./model/bracketContentElement";
import { OptedState } from "./model/optedState";

declare module "@ckeditor/ckeditor5-core" { // augment module to avoid TypeScript errors
    interface EditorConfig {
        /**
         * Initial track change suggestions to load into the editor.
         * We pass these through config because there is no initialSuggestions or similar property in the CKEditor5 API
         * (unlike the initialData property).
         */
        initialSuggestions?: TrackChangeSuggestion[],
        bracketOption?: {
            bracketOptionRenderer: (
                id: string,
                contentElements: BracketContentElement[],
                optedState: OptedState,
                isEditable: boolean,
                onOptedStateChanged: (newState: OptedState) => void,
                domElement: HTMLElement,
            ) => void;
        },
    }
}