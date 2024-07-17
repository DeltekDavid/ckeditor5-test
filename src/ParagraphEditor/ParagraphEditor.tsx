import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Undo } from 'ckeditor5';
import { Comments, TrackChanges, Users } from 'ckeditor5-premium-features';
import React from 'react';
import ReactDOM from 'react-dom';
import BracketOption from './BracketOption';
import BracketOptions from './ckeditor/bracketOptions/bracketOptions';
import TextIds from './ckeditor/textIds/textIds';
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
                // Load initial track changes (suggestions), if any.
                if (initialSuggestions?.length) {
                    // First populate the users from the suggestions
                    const usersIntegrationPlugin = editor.plugins.get('Users') as Users;
                    for (const suggestion of initialSuggestions) {
                        usersIntegrationPlugin.addUser({
                            id: suggestion.authorId,
                            name: 'Unknown User',
                        })
                    }

                    // Now add the suggestions
                    const trackChangesPlugin = editor.plugins.get('TrackChanges') as TrackChanges;
                    for (const suggestion of initialSuggestions) {
                        trackChangesPlugin.addSuggestion({
                            ...suggestion,
                            data: null,
                            attributes: {}
                        });
                    }
                }

                // Enable track changes by default (TODO make it a prop we pass in)
                editor.execute('trackChanges');

                // Prevent user from adding text before, after, above, or below block-level widgets like tables.
                // (Our tables are treated as a standalone unit, like our paragraphs)
                const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                widgetTypeAroundPlugin?.forceDisabled('OurApplication');

                // Attach inspector for debugging purposes.
                if (process.env.NODE_ENV === 'development') {
                    CKEditorInspector.attach(editor)
                }
            }}
        />
    );
}

export default ParagraphEditor;