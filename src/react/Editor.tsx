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
}

const Editor: React.FC<EditorProps> = ({ initialData }) => {

    return (
        <div>
            <div className="flex-container">
                <div className="flex-item">
                    <CKEditor
                        editor={ClassicalEditorBuild.ClassicEditor}
                        config={{
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
                            // You can store the "editor" and use when it is needed.
                            CKEditorInspector.detach('TestEditor');
                            CKEditorInspector.attach({ 'TestEditor': editor });
                            console.log('Editor is ready to use!', editor);
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
            </div>
        </div>
    );
}

export default Editor;