import { Command } from 'ckeditor5';
import { getItemByAttributeValue } from '../utils';

export default class ToggleBracketOptionCommand extends Command {
    execute({ bracketOptionId, _, newState }) {
        const model = this.editor.model;
        model.change(writer => {
            const root = model.document.getRoot();
            if (!root) {
                return;
            }
            const range = model.createRangeIn(root);
            const bracketOptionElement = getItemByAttributeValue(range, 'id', bracketOptionId);
            if (!bracketOptionElement) {
                return;
            }
            writer.setAttribute('optedState', newState, bracketOptionElement)
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        // The command is enabled when the "optedState" attribute
        // can be set on the current model selection.
        this.isEnabled = model.schema.checkAttributeInSelection(
            selection, 'optedState'
        );
    }
}