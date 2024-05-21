import { Command } from 'ckeditor5';

import { getItemByName } from '../utils';

export default class ModifySelectedUnitsOfMeasureCommand extends Command {
    execute({ imperial, metric }) {
        const model = this.editor.model;
        const range = model.document.selection?.getFirstRange()
        const selectedUnits = range ? getItemByName(range, 'unitsOfMeasure') : null;
        if (!selectedUnits) {
            return;
        }

        model.change(writer => {
            const sel = model?.document?.selection?.getFirstRange();
            writer.setAttribute('imperial', imperial, selectedUnits);
            writer.setAttribute('metric', metric, selectedUnits);
            if (sel) {
                // Clear selection without resetting caret back to start of document
                writer.setSelection(sel.end);
            }
        });
    }
}