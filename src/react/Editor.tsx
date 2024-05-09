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
    channelId: string,
    editorSuffix: string,
}

const Editor: React.FC<EditorProps> = (
    {
        initialData = "<p>Hello world!</p>",
        channelId,
        editorSuffix = "1",
    }) => {

    const [isActive, setIsActive] = React.useState(false);
    const editorId = 'TestEditor' + editorSuffix;
    const [editorData, setEditorData] = React.useState(initialData);
    return (
        <div>
            {isActive ?
                <CKEditor
                    editor={ClassicalEditorBuild.ClassicEditor}
                    config={{
                        collaboration: {
                            channelId: channelId + editorSuffix,
                        },
                        bracketOption: {
                            bracketOptionRenderer: (
                                id: string,
                                value: string,
                                optedState: OptedState,
                                onOptedStateChanged: (newState: OptedState) => void,
                                domElement: HTMLElement,
                            ) => {
                                const root = createRoot(domElement);

                                root.render(
                                    <BracketOption id={id} value={value} initialOptedState={optedState} onOptedStateChanged={onOptedStateChanged} />
                                );
                            }
                        },
                    }}
                    data={editorData}
                    onReady={editor => {
                        // Attach inspector
                        CKEditorInspector.detach(editorId + editorSuffix);
                        CKEditorInspector.attach({ editorId: editor });

                        // Render plain HTML rather than CKEditor when the editor loses focus.
                        // This is to test on-demand "activation" of CKEditor so we don't have to connect
                        // all of them to Real-Time-Collaboration at once.
                        // (CKEditor5 doesn't yet have a simply way to connect/disconnect from RTC.)
                        editor.ui.focusTracker.on('change:isFocused', (evt, data, isFocused) => {
                            if (!isFocused) {
                                setEditorData(editor.getData());
                                setIsActive(false);
                            }
                        });

                        console.log(`Editor "${editorId}" is ready to use!`, editor);
                    }}
                    onChange={(event) => {
                        console.log(event);
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                /> :
                <div onClick={() => setIsActive(true)}>
                    {parse(editorData!)}
                </div>}
        </div>
    );
}

export default Editor;