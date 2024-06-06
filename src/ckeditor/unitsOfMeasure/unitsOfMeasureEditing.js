import { Plugin } from 'ckeditor5'
import { toWidgetEditable, viewToModelPositionOutsideModelElement } from 'ckeditor5';

import CreateUnitsOfMeasureCommand from './createUnitsOfMeasureCommand';
import ModifySelectedUnitsOfMeasureCommand from './modifySelectedUnitsOfMeasureCommand';
import { getChildByAttributeValue } from '../utils';

export default class UnitsOfMeasureEditing extends Plugin {
    init() {
        this._defineSchema()
        this._defineConverters()

        this.editor.commands.add('createUnitsOfMeasure', new CreateUnitsOfMeasureCommand(this.editor));
        this.editor.commands.add('modifySelectedUnitsOfMeasure', new ModifySelectedUnitsOfMeasureCommand(this.editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('units-of-measure'))
        );

        // Enable "create units of measure" command when track changes are enabled.
        if (this.editor.plugins.has('TrackChangesEditing')) {
            const trackChangesEditing = this.editor.plugins.get('TrackChangesEditing');
            if (trackChangesEditing) {
                this.enableTrackChangeIntegration(trackChangesEditing);
            }
        }
    }

    enableTrackChangeIntegration(trackChangesPlugin) {
        // Track creation of units of measure.
        trackChangesPlugin.enableCommand('createUnitsOfMeasure');
        trackChangesPlugin.descriptionFactory.registerElementLabel(
            'unitsOfMeasure',
            quantity => quantity === 1 ? 'units of measure' : quantity + ' units of measure'
        );

        // Track changes to units of measure.
        trackChangesPlugin.enableDefaultAttributesIntegration('modifySelectedUnitsOfMeasure');
        trackChangesPlugin.registerInlineAttribute('metric');
        trackChangesPlugin.registerInlineAttribute('imperial');
    }

    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('unitsOfMeasure', {
            // Behaves like a self-contained inline object (e.g. an inline image)
            // allowed in places where $text is allowed (e.g. in paragraphs).
            inheritAllFrom: '$inlineObject',

            allowAttributes: ['imperial', 'metric']
        })
    }

    _defineConverters() {
        const conversion = this.editor.conversion

        // View-model to model
        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'units-of-measure',
            },
            model: (viewElement, { writer: modelWriter }) => {
                const imperialValue = (getChildByAttributeValue(viewElement, 'class', 'imperial'))?.getChild(0)?.data
                const metricValue = (getChildByAttributeValue(viewElement, 'class', 'metric'))?.getChild(0)?.data
                return modelWriter.createElement('unitsOfMeasure', { imperial: imperialValue, metric: metricValue });
            }
        })

        // Model to editing view
        conversion.for('editingDowncast').elementToElement({
            model: 'unitsOfMeasure',
            view: (modelItem, { writer: viewWriter }) => {
                // Only show desired units types in the editing view.
                const showUnits = this.editor.config.get('showUnits');
                const widgetElement = createUnitsOfMeasureView(modelItem, viewWriter, showUnits?.imperial, showUnits?.metric);

                // Enable widget handling on a unitsOfMeasure element inside the editing view.
                return toWidgetEditable(widgetElement, viewWriter);
            }
        });

        // Model to data view
        // Always include both units types in the data view so it can be converted back to the model.
        conversion.for('dataDowncast').elementToElement({
            model: 'unitsOfMeasure',
            view: (modelItem, { writer: viewWriter }) => createUnitsOfMeasureView(modelItem, viewWriter, true, true)
        });

        // Helper method for both downcast converters.
        function createUnitsOfMeasureView(modelItem, viewWriter, includeImperial, includeMetric) {
            const imperialText = modelItem.getAttribute('imperial')
            const metricText = modelItem.getAttribute('metric')
            const unitsElements = []
            if (includeImperial && !includeMetric) {
                // "1 in.""
                unitsElements.push(viewWriter.createContainerElement('span', { class: 'imperial' }, [viewWriter.createText(imperialText)]))
            } else if (!includeImperial && includeMetric) {
                // "2.54 cm"
                unitsElements.push(viewWriter.createContainerElement('span', { class: 'metric' }, [viewWriter.createText(metricText)]))
            } else {
                // "1 in. (2.54 cm)"
                unitsElements.push(viewWriter.createContainerElement('span', { class: 'imperial' }, [viewWriter.createText(imperialText)]))
                unitsElements.push(viewWriter.createContainerElement('span', { class: 'metric' }, [viewWriter.createText(` (${metricText})`)]));
            }
            const unitsOfMeasureView = viewWriter.createContainerElement('span', { class: 'units-of-measure' }, unitsElements)

            return unitsOfMeasureView
        }
    }
}