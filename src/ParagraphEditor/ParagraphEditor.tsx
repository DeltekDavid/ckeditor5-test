import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Undo } from 'ckeditor5';
import { Comments, TrackChanges } from 'ckeditor5-premium-features';
import React from 'react';
import ReactDOM from 'react-dom';
import BracketOption from './BracketOption';
import BracketOptions from './ckeditor/bracketOptions/bracketOptions';
import TextIds from './ckeditor/textIds/textIds';
import UnitsOfMeasure from './ckeditor/unitsOfMeasure/unitsOfMeasure';
import { BracketContentElement } from './model/bracketContentElement';
import { OptedState } from './model/optedState';
import './styles.css';


export interface EditorProps {
    /**
     * Initial editor data in HTML format.
     */
    initialData?: string,
}

const ParagraphEditor: React.FC<EditorProps> = (
    {
        initialData = "<p>Hello world!</p>",
    }) => {

    const licenseKey = process.env.REACT_APP_CKEditorLicenseKey || '';
    return (
        <CKEditor
            data-testid="paragraph-editor"
            editor={ClassicEditor}
            config={{
                licenseKey: licenseKey,
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
                // Attach inspector for debugging purposes.
                if (process.env.NODE_ENV === 'development') {
                    CKEditorInspector.attach(editor)
                }

                // Enable track changes by default (TODO make it a prop)
                editor.execute('trackChanges');

                // Prevent user from adding text before, after, above, or below block-level widgets like tables.
                // (Our tables are treated as a standalone unit, like our paragraphs)
                const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                widgetTypeAroundPlugin?.forceDisabled('OurApplication');
            }}
        />
    );
}

export default ParagraphEditor;