import { Plugin } from '@ckeditor/ckeditor5-core'

import { Widget, toWidget, toWidgetEditable, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget';

export default class UnitsOfMeasureEditing extends Plugin {
    init() {
        console.log('UnitsOfMeasureEditing was initialized')

        this._defineSchema()
        this._defineConverters()

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('units-of-measure'))
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('unitsOfMeasure', {
            // Behaves like a self-contained inline object (e.g. an inline image)
            // allowed in places where $text is allowed (e.g. in paragraphs).
            inheritAllFrom: '$inlineObject',

            allowAttributes: ['value']
        })
    }

    _defineConverters() {
        const conversion = this.editor.conversion

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'units-of-measure',
            },
            model: (viewElement, { writer: modelWriter }) => {
                // Extract the "value" from "{value}".
                const value = viewElement.getChild(0).data.slice(1, -1);

                return modelWriter.createElement('unitsOfMeasure', { value });
            }
        })

        conversion.for('editingDowncast').elementToElement({
            model: 'unitsOfMeasure',
            view: (modelItem, { writer: viewWriter }) => {
                const widgetElement = createUnitsOfMeasureView(modelItem, viewWriter);

                // Enable widget handling on a unitsOfMeasure element inside the editing view.
                return toWidgetEditable(widgetElement, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'unitsOfMeasure',
            view: (modelItem, { writer: viewWriter }) => createUnitsOfMeasureView(modelItem, viewWriter)
        });

        // Helper method for both downcast converters.
        function createUnitsOfMeasureView(modelItem, viewWriter) {
            const value = modelItem.getAttribute('value');

            const unitsOfMeasureView = viewWriter.createEditableElement('span', {
                class: 'units-of-measure'
            });

            // Insert the unitsOfMeasure value (as a text).
            const innerText = viewWriter.createText('{' + value + '}');
            viewWriter.insert(viewWriter.createPositionAt(unitsOfMeasureView, 0), innerText);

            return unitsOfMeasureView;
        }
    }
}