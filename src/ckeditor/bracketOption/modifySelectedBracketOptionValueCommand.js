import { Command } from 'ckeditor5';

import { getItemByName } from '../utils';

export default class ModifySelectedBracketOptionValueCommand extends Command {
    execute({ value }) {
        const model = this.editor.model;
        const range = model.document.selection?.getFirstRange()
        const selectedOption = range ? getItemByName(range, 'bracketOption') : null;
        if (!selectedOption) {
            return;
        }

        model.change(writer => {
            const sel = model?.document?.selection?.getFirstRange();
            writer.setAttribute('value', value, selectedOption);
            if (sel) {
                // Clear selection without resetting caret back to start of document
                writer.setSelection(sel.end);
            }
        });
    }
}