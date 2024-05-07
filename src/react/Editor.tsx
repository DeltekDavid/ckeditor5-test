// App.jsx / App.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';

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
        initialData,
        channelId,
        editorSuffix = "1",
    }) => {

    const editorId = 'TestEditor' + editorSuffix;
    return (
        <div>
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
                data={initialData}
                onReady={editor => {
                    // Attach inspector
                    CKEditorInspector.detach(editorId + editorSuffix);
                    CKEditorInspector.attach({ editorId: editor });

                    // Hide toolbar by default and show it when editor is focused
                    const toolbarElement = editor.ui.view.toolbar.element;
                    if (toolbarElement) {
                        toolbarElement.style.display = 'none';
                    }
                    editor.ui.focusTracker.on( 'change:isFocused', ( evt, data, isFocused ) => {
                        const toolbar = editor.ui.view.toolbar.element;
                        if (toolbar) {
                            toolbar.style.display = isFocused ? 'flex' : 'none';
                        }
                    } );

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
            />
        </div>
    );
}

export default Editor;