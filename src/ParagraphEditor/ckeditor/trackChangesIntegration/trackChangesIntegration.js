import { Plugin } from 'ckeditor5';

export default class TrackChangesIntegration extends Plugin {
    static get requires() {
        return ['TrackChanges', 'UsersIntegration'];
    }

    static get pluginName() {
        return 'TrackChangesIntegration';
    }

    init() {
        const trackChangesPlugin = this.editor.plugins.get('TrackChanges');

        // Load the initial suggestions from the config.
        // We have to do it this way since there's no prop to pass in for initial suggestions,
        // unlike initialData.
        const initialSuggestions = this.editor.config.get('initialSuggestions');
        if (!initialSuggestions?.length) {
            return;
        }

        for (const suggestion of initialSuggestions) {
            trackChangesPlugin.addSuggestion(
                {
                    ...suggestion,
                    data: null,
                    attributes: {}
                });
        }
    }
}