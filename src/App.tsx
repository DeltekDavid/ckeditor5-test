// App.jsx / App.tsx
import { useState } from 'react';
import Editor, { EditorProps } from './react/Editor';
import ConfigurationDialog from './react/configuration-dialog';

const initialData = "<p>After construction ends, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'>{14,000 cu. ft. (4 300 000 L)}</span> of outdoor air per <span class='units-of-measure'>{sq. ft. (sq. m)}</span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'>{60 deg F (16 deg C)}</span> and a relative humidity no higher than 60 percent.</p>";

const App: React.FC = () => {

    const [editorProps, setEditorProps] = useState<EditorProps | null>(null);

    return editorProps === null ? <ConfigurationDialog // show config dialog if editor props (token URL, etc) are not set
        onSubmit={(config: any) => setEditorProps(
            {
                channelId: config.channelId,
                tokenUrl: config.tokenUrl,
                webSocketUrl: config.webSocketUrl,
            })} /> : (
        <div className="App">
            <h2>Using CKEditor&nbsp;5 from source in React</h2>
            <Editor channelId={editorProps!.channelId} tokenUrl={editorProps!.tokenUrl} webSocketUrl={editorProps!.webSocketUrl} initialData={initialData} />
        </div>
    );
}

export default App;