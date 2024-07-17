import { Plugin } from 'ckeditor5';

export default class UsersIntegration extends Plugin {
    static get requires() {
        return ['Users'];
    }

    static get pluginName() {
        return 'UsersIntegration';
    }

    init() {
        // Add users
        const usersPlugin = this.editor.plugins.get('Users');

        // TODO configure current user (me) based on active Specpoint user
        usersPlugin.addUser({
            id: 'user-1',
            name: 'Sample User'
        });

        usersPlugin.defineMe('user-1');

        // Add users from initialSuggestions provided in editor config.
        const initialSuggestions = this.editor.config.get('initialSuggestions');
        if (!initialSuggestions?.length) {
            return;
        }

        for (const suggestion of initialSuggestions) {
            const userId = suggestion.authorId;
            if (!usersPlugin.getUser(userId)) {
                usersPlugin.addUser({
                    id: userId,
                    name: 'TODO User Name Here'
                });
            }
        }
    }
}