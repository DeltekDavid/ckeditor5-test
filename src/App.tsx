// App.jsx / App.tsx
import { useRef, useState } from 'react';
import Editor from './react/Editor';
import ConfigurationDialog from './react/configuration-dialog';
import { CKEditorContext } from '@ckeditor/ckeditor5-react';
import ClassicalEditorBuild from './ckeditor/context';

const paragraph1 = "<p>1. After construction ends, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>14,000 cu. ft.</span><span class='metric'>4 300 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>60 deg F</span><span class='metric'>16 deg C</span></span> and a relative humidity no higher than 60 percent.</p>";
const paragraph2 = "<p>2. During construction, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>10,000 cu. ft.</span><span class='metric'>3 000 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>65 deg F</span><span class='metric'>18 deg C</span></span> and a relative humidity no higher than 50 percent.</p>";
const paragraph3 = "<p>3. After occupancy, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='OPTED_IN'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='OPTED_OUT'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>12,000 cu. ft.</span><span class='metric'>3 600 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>70 deg F</span><span class='metric'>21 deg C</span></span> and a relative humidity no higher than 55 percent.</p>";

interface CloudConfig {
    tokenUrl: string,
    webSocketUrl: string,
    channelId: string,
}

const App: React.FC = () => {
    const [cloudConfig, setCloudConfig] = useState<CloudConfig | null>(null);

    const presenceListElementRef = useRef<HTMLDivElement>(null);
    const sidebarElementRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            <h2>Using CKEditor&nbsp;5 in React</h2>
            <p>Click a paragraph to edit it.</p>
            <div>
                <div ref={presenceListElementRef}></div>
            </div>
            <div className="outer-container">
                {cloudConfig
                    && <CKEditorContext
                        context={ClassicalEditorBuild.Context}
                        config={
                            {
                                cloudServices: {
                                    tokenUrl: cloudConfig!.tokenUrl,
                                    webSocketUrl: cloudConfig!.webSocketUrl
                                },
                                collaboration: {
                                    channelId: cloudConfig!.channelId
                                },
                                presenceList: {
                                    container: presenceListElementRef.current
                                },
                                sidebar: {
                                    container: sidebarElementRef.current!
                                },
                            }
                        }
                    >
                        <div className="editor-container">
                            <div className="editor-instance">
                                <Editor initialData={paragraph1} channelId={cloudConfig.channelId} editorSuffix='1' />
                            </div>
                            <div className="editor-instance">
                                <Editor initialData={paragraph2} channelId={cloudConfig.channelId} editorSuffix='2' />
                            </div>
                            {/* show a third editor for Tom Rowling to show that if another user doesn't have this editor open, they won't see its track changes in the comments thread*/}
                            {cloudConfig?.tokenUrl?.indexOf("Rowling") !== -1
                                && <div className="editor-instance">
                                    <Editor initialData={paragraph3} channelId={cloudConfig.channelId} editorSuffix='3' />
                                </div>}
                        </div>
                    </CKEditorContext>}
                <div className="sidebar">
                    <div ref={sidebarElementRef} ></div>
                </div>

            </div>
            {!cloudConfig
                && <ConfigurationDialog // show config dialog if editor props (token URL, etc) are not set
                    onSubmit={(config: any) => {
                        setCloudConfig(
                            {
                                channelId: config.channelId,
                                tokenUrl: config.tokenUrl,
                                webSocketUrl: config.webSocketUrl,
                            });
                    }} />}
        </div>
    );
}

export default App;