// App.jsx / App.tsx

import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

// NOTE: Use the editor from source (not a build)!
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import UnitsOfMeasure from '.././ckeditor/unitsOfMeasure';
import { default as BracketOptionPlugin } from '.././ckeditor/bracketOption';
import { OptedState } from '.././model/optionItemState';
import { createRoot } from 'react-dom/client';
import BracketOption from '.././react/BracketOption';
import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import TrackChangesEditing from '@ckeditor/ckeditor5-track-changes/src/trackchangesediting';


export interface EditorProps {
    tokenUrl: string,
    webSocketUrl: string,
    channelId: string,
    initialData?: string,
}

const Editor: React.FC<EditorProps> = ({ tokenUrl, webSocketUrl, channelId, initialData }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                plugins: [
                    Essentials,
                    Bold,
                    Italic,
                    Paragraph,
                    CloudServices,
                    Comments,
                    TrackChanges,
                    RealTimeCollaborativeComments,
                    RealTimeCollaborativeTrackChanges,
                    UnitsOfMeasure,
                    BracketOptionPlugin
                ],
                toolbar: [
                    'trackChanges',
                ],
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
                cloudServices: {
                    tokenUrl: tokenUrl,
                    webSocketUrl: webSocketUrl
                },
                collaboration: {
                    channelId: channelId
                },
            }}
            data={initialData}
            onReady={editor => {
                // You can store the "editor" and use when it is needed.
                CKEditorInspector.detach('TestEditor');
                CKEditorInspector.attach({ 'TestEditor': editor });
                editor.commands.get( 'trackChanges' )?.execute(); // enable track changes by default
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
    );
}

export default Editor;