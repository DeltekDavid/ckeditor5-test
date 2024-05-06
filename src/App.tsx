// App.jsx / App.tsx
import { useEffect, useRef, useState } from 'react';
import Editor from './react/Editor';
import ConfigurationDialog from './react/configuration-dialog';
import { CKEditorContext } from '@ckeditor/ckeditor5-react';
import ClassicalEditorBuild from './ckeditor/context';

const initialData = "<p>After construction ends, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>14,000 cu. ft.</span><span class='metric'>4 300 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>60 deg F</span><span class='metric'>16 deg C</span></span> and a relative humidity no higher than 60 percent.</p>";

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
            <div>
                <div ref={presenceListElementRef}></div>
            </div>
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
                    <Editor initialData={initialData} />
                </CKEditorContext>}
            <div>
                <div ref={sidebarElementRef} ></div>
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