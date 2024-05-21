import { Command } from 'ckeditor5';

export default class CreateUnitsOfMeasureCommand extends Command {
    execute({ imperial, metric }) {
        const model = this.editor.model;
        model.change(writer => {
            const unitsOfMeasure = writer.createElement('unitsOfMeasure', { imperial, metric });
            model.insertContent(unitsOfMeasure);
        });
    }
}