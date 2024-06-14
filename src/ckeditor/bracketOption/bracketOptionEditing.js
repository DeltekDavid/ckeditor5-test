import { Plugin } from 'ckeditor5'
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5';

import ToggleBracketOptionCommand from './toggleBracketOptionCommand'
import { reRunConverters, getChildByAttributeValue } from '../utils';
import modifyBracketOptionValueCommand from './modifyBracketOptionValueCommand';
import { BracketContentElementType } from '../../model/bracketContentElement';

export default class BracketOptionEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {

        this._defineSchema()
        this._defineConverters()

        this.editor.commands.add('toggleBracketOption', new ToggleBracketOptionCommand(this.editor))
        this.editor.commands.add('modifyBracketOptionValue', new modifyBracketOptionValueCommand(this.editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('bracket-option'))
        );

        // Subscribe to model changes so we can re-run the converters 
        // when another user updates the model in Real-Time Collaboration.
        // (Otherwise our custom React widgets won't update in response to other user's changes.)
        this.runConvertersOnModelChange();

        // Enable "toggle bracket option" command when track changes are enabled.
        if (this.editor.plugins.has('TrackChangesEditing')) {
            const trackChangesEditing = this.editor.plugins.get('TrackChangesEditing');
            if (trackChangesEditing) {
                this.enableTrackChangeIntegration(trackChangesEditing);
            }
        }
    }

    runConvertersOnModelChange() {
        this.editor.model.document.on('change:data', () => {
            reRunConverters(this.editor);
        });
    }

    enableTrackChangeIntegration(trackChangesPlugin) {
        // Track toggling of bracket options.
        trackChangesPlugin.enableDefaultAttributesIntegration('toggleBracketOption');
        trackChangesPlugin.registerInlineAttribute('optedState');

        // Create friendly TC descriptions for bracket option toggles.
        trackChangesPlugin.descriptionFactory.registerDescriptionCallback(suggestion => {
            const data = suggestion.data;
            if (!data) {
                return;
            }

            const attributeName = data.key;
            if (attributeName !== 'optedState') {
                return;
            }

            const optedState = data.newValue;
            const value = suggestion.getFirstRange()?.start?.nodeAfter?.getChild(0)?.getAttribute('value');
            const content = optedState === 'OPTED_IN'
                ? `Selected option: "${value}"`
                : optedState === 'OPTED_OUT' ? `Deselected option: "${value}"`
                    : `Reset option: "${value}"`;
            return { type: 'format', content };
        });

        // Track setting of fill-in-the-blank values.
        trackChangesPlugin.enableDefaultAttributesIntegration('modifyBracketOptionValue');
        trackChangesPlugin.registerInlineAttribute('value');

        // Create friendly TC descriptions for setting fill-in-the-blank values.
        trackChangesPlugin.descriptionFactory.registerDescriptionCallback(suggestion => {
            const data = suggestion.data;
            if (!data) {
                return;
            }

            const attributeName = data.key;
            if (attributeName !== 'value') {
                return;
            }

            const value = data.newValue;
            const content = `Set custom option value: "${value}"`;
            return { type: 'format', content };
        });
    }

    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('bracketOption', {
            // Behaves like a self-contained inline object (e.g. an inline image)
            // allowed in places where $text is allowed (e.g. in paragraphs).
            inheritAllFrom: '$inlineObject',

            allowAttributes: [
                'id',
                'optedState' // 'undecided', 'optedIn', or 'optedOut'
            ]
        })

        schema.register('nestedUnitsOfMeasure', {
            inheritAllFrom: '$inlineObject',
            allowAttributes: ['imperial', 'metric']
        })

        // Use a custom element for nested text, since regular text nested under a bracket causes extra text to render/
        // (Regular text is automatically converted to a text node alongside the bracket's own React component.)
        schema.register('nestedText', {
            inheritAllFrom: '$inlineObject',
            allowAttributes: ['value'],
        })
    }

    _defineConverters() {
        const editor = this.editor
        const conversion = editor.conversion
        const renderBracketOption = editor.config.get('bracketOption').bracketOptionRenderer

        // <bracketOption> convert data view (HTML-like structure) to model
        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'bracket-option',
            },
            model: (viewElement, { writer: modelWriter }) => {
                const bracketElement = modelWriter.createElement('bracketOption',
                    {
                        id: viewElement.getAttribute('data-id'), // read custom attributes ("data-" prefix) from our span
                        optedState: viewElement.getAttribute('data-opted-state'),
                        isEditable: viewElement.getAttribute('data-editable') === 'true',
                    });

                // Insert child text and units-of-measure nodes that comprise the bracket option's content.
                for (const childElement of viewElement.getChildren()) {
                    if (childElement.is('$text')) {
                        const nestedText = modelWriter.createElement('nestedText', {
                            value: childElement.data
                        });
                        modelWriter.insert(nestedText, bracketElement, 'end');
                    }
                    else if (childElement.hasClass('nested-units-of-measure')) {
                        const imperialNode = getChildByAttributeValue(childElement, 'class', 'imperial');
                        const imperialValue = (imperialNode)?.getChild(0)?.data
                        const metricNode = getChildByAttributeValue(childElement, 'class', 'metric');
                        const metricValue = (metricNode)?.getChild(0)?.data
                        const unitsOfMeasureElement = modelWriter.createElement('nestedUnitsOfMeasure', {
                            imperial: imperialValue,
                            metric: metricValue,
                        });
                        modelWriter.insert(unitsOfMeasureElement, bracketElement, 'end');
                    }
                }
                return bracketElement;
            }
        })

        // <bracketOption> convert model to data view
        conversion.for('dataDowncast').elementToElement({
            model: 'bracketOption',
            view: (modelElement, { writer: viewWriter, consumable }) => {
                // In the data view, the model:
                //    <bracketOption id="123" optedState="OPTED_IN">text</bracketOption>
                //
                // corresponds to view node:
                //    <span class="bracketOption" data-id="123" opted-state="OPTED_IN">text</span>
                const span = viewWriter.createContainerElement('span', {
                    class: 'bracket-option',
                    'data-id': modelElement.getAttribute('id'),
                    'data-opted-state': modelElement.getAttribute('optedState'),
                    'data-editable': modelElement.getAttribute('isEditable') === true ? 'true' : 'false',
                });

                if (modelElement.childCount > 0) {
                    for (const childElement of modelElement.getChildren()) {
                        const imperialUnits = childElement.getAttribute('imperial')
                        const metricUnits = childElement.getAttribute('metric')
                        if (imperialUnits || metricUnits) {
                            viewWriter.createContainerElement('span', {
                                class: 'nested-units-of-measure',
                                imperial: imperialUnits,
                                metric: metricUnits,
                            }, span)
                        }
                        else {
                            viewWriter.createContainerElement('span', {
                                class: 'nested-text',
                                value: childElement.getAttribute('value')
                            }, span)
                        }

                        // Consume child elements to avoid "conversion-model-consumable-not-consumed" error
                        consumable.consume(childElement, 'insert');
                    }
                }
                return span;
            }
        });

        // <bracketOption> convert model to editing view
        conversion.for('editingDowncast').elementToElement({
            model: 'bracketOption',
            view: (modelElement, { writer: viewWriter, consumable }) => {
                // In the editing view, the model <bracketOption> corresponds to:
                //
                // <span class="bracket-option" data-id="...">
                //     <span class="bracket-option__react-wrapper">
                //         <BracketOption /> (React component)
                //     </span>
                // </span>
                const id = modelElement.getAttribute('id')
                const optedState = modelElement.getAttribute('optedState')
                const isEditable = modelElement.getAttribute('isEditable')

                // The outermost <span class="bracket-option" data-id="..."></span> element.
                const span = viewWriter.createContainerElement('span', {
                    class: 'bracket-option',
                    'data-id': id
                })

                // The inner <span class="bracket-option__react-wrapper"></span> element.
                // This element will host a React <BracketOption /> component.
                const reactWrapper = viewWriter.createRawElement('span', {
                    class: 'bracket-option__react-wrapper'
                }, function (domElement) {
                    // This is the place where React renders the actual bracket-option preview hosted
                    // by a UIElement in the view. You are using a function (renderer) passed as
                    // editor.config.bracket-options#bracketOptionRenderer.

                    const children = Array.from(modelElement.getChildren());
                    const childElements = children.map(child => {
                        return {
                            type: child.getAttribute('imperial') ? BracketContentElementType.UnitsOfMeasure : BracketContentElementType.Text,
                            text: child.getAttribute('value'),
                            imperialUnits: child.getAttribute('imperial'),
                            metricUnits: child.getAttribute('metric'),
                        }
                    })
                    renderBracketOption(id, childElements, optedState, isEditable, (newState) => {
                        editor.execute('toggleBracketOption', { bracketOptionId: id, newState })
                    }, domElement);
                })

                viewWriter.insert(viewWriter.createPositionAt(span, 0), reactWrapper)

                // Consume child elements to avoid "conversion-model-consumable-not-consumed" error
                for (const child of modelElement.getChildren()) {
                    consumable.consume(child, 'insert')
                }

                return toWidget(span, viewWriter, { label: 'bracket option widget' })
            }
        });
    }
}