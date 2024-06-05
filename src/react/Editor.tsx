// App.jsx / App.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';

import parse from 'html-react-parser';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import ClassicalEditorBuild from '.././ckeditor/context';
import { OptedState } from '.././model/optionItemState';
import BracketOption from '.././react/BracketOption';

export interface EditorProps {
    initialData?: string,
    channelId?: string,
    editorSuffix: string,
}

const Editor: React.FC<EditorProps> = (
    {
        initialData = "<p>Hello world!</p>",
        channelId,
        editorSuffix = "1",
    }) => {

    const alwaysRenderEditor = true; // set to true to always render the editor, even when it's not active. Useful for debugging.
    const [isActive, setIsActive] = React.useState(false);
    const editorId = 'TestEditor' + editorSuffix;
    const [paragraphContent, setParagraphContent] = React.useState(initialData);
    return (
        <div>
            {isActive || alwaysRenderEditor ?
                <CKEditor
                    editor={ClassicalEditorBuild.OurClassicEditor}
                    config={{
                        collaboration: channelId ? {
                            channelId: channelId + editorSuffix,
                        } : undefined,
                        bracketOption: {
                            bracketOptionRenderer: (
                                id: string,
                                value: string,
                                optedState: OptedState,
                                isEditable: boolean,
                                onOptedStateChanged: (newState: OptedState) => void,
                                domElement: HTMLElement,
                            ) => {
                                const root = createRoot(domElement);

                                root.render(
                                    <BracketOption id={id} value={value} initialOptedState={optedState} isEditable={isEditable} onOptedStateChanged={onOptedStateChanged} />
                                );
                            }
                        },
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
                    data={paragraphContent}
                    onReady={editor => {
                        // Attach inspector
                        CKEditorInspector.detach(editorId);
                        CKEditorInspector.attach({ [editorId]: editor });

                        // Render plain HTML rather than CKEditor when the editor loses focus.
                        // This is to test on-demand "activation" of CKEditor so we don't have to connect
                        // all of them to Real-Time-Collaboration at once.
                        // (CKEditor5 doesn't yet have a simply way to connect/disconnect from RTC.)
                        editor.ui.focusTracker.on('change:isFocused', (evt, data, isFocused) => {
                            if (!isFocused) {
                                setParagraphContent(editor.getData());
                                setIsActive(false);
                            }
                        });

                        // Prevent user from adding text before, after, above, or below block-level widgets like tables.
                        // (Our tables are treated as a standalone unit, like our paragraphs)
                        const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');
                        widgetTypeAroundPlugin?.forceDisabled('OurApplication');
                    }}
                /> :
                // Render plain HTML rather than CKEditor when the editor is not active.
                // Clicking it will activate CKEditor.
                <div onClick={() => setIsActive(true)}>
                    {parse(paragraphContent!)}
                </div>}
        </div>
    );
}

export default Editor;