import { Plugin } from 'ckeditor5';

export default class UsersIntegration extends Plugin {
    static get requires() {
        return ['Users'];
    }

    static get pluginName() {
        return 'UsersIntegration';
    }

    init() {
        const usersPlugin = this.editor.plugins.get('Users');

        usersPlugin.addUser({
            id: 'user-1',
            name: 'Sample User'
        });

        usersPlugin.defineMe('user-1');
    }
}