import { Command } from 'ckeditor5';

import { getItemByAttributeValue } from '../utils';

export default class ModifyBracketOptionValueCommand extends Command {
    execute({ bracketOptionId, _, newValue }) {
        const model = this.editor.model;
        model.change(writer => {
            const root = model.document.getRoot();
            if (!root) {
                return;
            }
            const range = model.createRangeIn(root);
            const bracketOptionElement = getItemByAttributeValue(range, 'id', bracketOptionId);
            if (!bracketOptionElement || !bracketOptionElement.getAttribute('isEditable')) {
                return;
            }
            writer.setAttribute('value', newValue, bracketOptionElement)
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        // The command is enabled when the "value" attribute
        // can be set on the current model selection.
        this.isEnabled = model.schema.checkAttributeInSelection(
            selection, 'value'
        );
    }
}