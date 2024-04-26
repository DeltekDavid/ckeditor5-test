// App.jsx / App.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import UnitsOfMeasure from '../ckeditor/unitsOfMeasure/unitsOfMeasure';
import { default as BracketOptionPlugin } from '../ckeditor/bracketOption/bracketOption';
import { OptedState } from '.././model/optionItemState';
import BracketOption from '.././react/BracketOption';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

export interface EditorProps {
    tokenUrl: string,
    webSocketUrl: string,
    channelId: string,
    initialData?: string,
}

const Editor: React.FC<EditorProps> = ({ tokenUrl, webSocketUrl, channelId, initialData }) => {
    // The presence list needs a valid element reference, so render the editor only after the initial layout is ready.
    const [isLayoutReady, setIsLayoutReady] = React.useState(false);

    const presenceListElementRef = React.useRef<HTMLDivElement>(null);
    const sidebarElementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // The layout is ready when the presence list element is available.
        setIsLayoutReady(true);
    }, []);

    return (
        <div>
            <div>
                <div ref={presenceListElementRef}></div>
            </div>
            <div className="flex-container">
                <div className="flex-item">
                    {isLayoutReady && <CKEditor
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
                                PresenceList,
                                RealTimeCollaborativeComments,
                                RealTimeCollaborativeTrackChanges,
                                UnitsOfMeasure,
                                BracketOptionPlugin
                            ],
                            toolbar: [
                                'undo',
                                'redo',
                                '|',
                                'trackChanges',
                                '|',
                                'showUnits',
                                'unitsOfMeasure',
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
                            presenceList: {
                                container: presenceListElementRef.current
                            },
                            sidebar: {
                                container: sidebarElementRef.current!
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
                    />}
                </div>
                <div className="flex-item">
                    <div ref={sidebarElementRef} ></div>
                </div>
            </div>
        </div>
    );
}

export default Editor;