import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Undo } from 'ckeditor5';
import { Comments, TrackChanges } from 'ckeditor5-premium-features';
import { processEnv } from 'components/configuration/environmentVariables';
import React from 'react';
import ReactDOM from 'react-dom';
import BracketOption from './BracketOption';
import BracketOptions from './ckeditor/bracketOptions/bracketOptions';
import TextIds from './ckeditor/textIds/textIds';
import TrackChangesIntegration from './ckeditor/trackChangesIntegration/trackChangesIntegration';
import UnitsOfMeasure from './ckeditor/unitsOfMeasure/unitsOfMeasure';
import UsersIntegration from './ckeditor/usersIntegration/usersIntegration';
import { TrackChangeSuggestion } from './contentUtils';
import { BracketContentElement } from './model/bracketContentElement';
import { OptedState } from './model/optedState';
import './styles.css';


export interface EditorProps {
    /**
     * Initial editor data in HTML format.
     */
    initialData?: string,

    /**
     * Initial track changes (suggestions) to load into the editor.
     */
    initialSuggestions?: TrackChangeSuggestion[],
}

const ParagraphEditor: React.FC<EditorProps> = (
    {
        initialData = "<p>Hello world!</p>",
        initialSuggestions,
    }) => {

    return (
        <CKEditor
            data-testid="paragraph-editor"
            editor={ClassicEditor}
            config={{
                licenseKey: process.env.REACT_APP_CKEditorLicenseKey || '',
                initialSuggestions: initialSuggestions,
                bracketOption: {
                    bracketOptionRenderer: (
                        id: string,
                        contentElements: BracketContentElement[],
                        optedState: OptedState,
                        isEditable: boolean,
                        onOptedStateChanged: (newState: OptedState) => void,
                        domElement: HTMLElement,
                    ) => {
                        ReactDOM.render(
                            <BracketOption id={id}
                                contentElements={contentElements}
                                optedState={optedState}
                                isEditable={isEditable}
                                onOptedStateChanged={onOptedStateChanged} />,
                            domElement
                        );
                    }
                },
                plugins: [
                    Essentials,
                    Paragraph,
                    Undo,
                    UsersIntegration,
                    Comments,
                    TrackChanges,
                    TrackChangesIntegration,
                    TextIds,
                    UnitsOfMeasure,
                    BracketOptions,
                ],
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                    ],
                    tableProperties: {
                        defaultProperties: {
                            alignment: 'left', // left-align tables by default, like our paragraphs
                        }
                    }
                }
            }}
            data={initialData}
            onReady={editor => {
                // Enable track changes by default (TODO make it a prop we pass in)
                editor.execute('trackChanges');

                // Prevent user from adding text before, after, above, or below block-level widgets like tables.
                // (Our tables are treated as a standalone unit, like our paragraphs)
                const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                widgetTypeAroundPlugin?.forceDisabled('OurApplication');

                // TODO define current user

                // Attach inspector for debugging purposes.
                if (process.env.NODE_ENV === 'development') {
                    CKEditorInspector.attach(editor)
                }
            }}
        />
    );
}

export default ParagraphEditor;