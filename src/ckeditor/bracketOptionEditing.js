import { Plugin } from '@ckeditor/ckeditor5-core'

import { Widget, toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget';

export default class BracketOptionEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.log('BracketOptionEditing was initialized')

        this._defineSchema()
        this._defineConverters()

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('bracket-option'))
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('bracketOption', {
            // Behaves like a self-contained inline object (e.g. an inline image)
            // allowed in places where $text is allowed (e.g. in paragraphs).
            inheritAllFrom: '$inlineObject',

            allowAttributes: [
                'id',
                'value', // content of bracket option (text for now; TODO allow composite content including units-of-measure)
                'optedState' // 'undecided', 'optedIn', or 'optedOut'
            ]
        })
    }

    _defineConverters() {
        const editor = this.editor
        const model = editor.model
        const conversion = editor.conversion
        const renderBracketOption = editor.config.get('bracketOption').bracketOptionRenderer

        // <bracketOption> convert data view (HTML-like structure) to model
        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'bracket-option',
            },
            model: (viewElement, { writer: modelWriter }) => {
                return modelWriter.createElement('bracketOption',
                    {
                        id: viewElement.getAttribute('data-id'), // read custom attributes ("data-" prefix) from our span
                        value: viewElement.getChild(0).data, // read the text content of the span
                        optedState: viewElement.getAttribute('data-opted-state')
                    });
            }
        })

        // <bracketOption> convert model to data view
        conversion.for('dataDowncast').elementToElement({
            model: 'bracketOption',
            view: (modelElement, { writer: viewWriter }) => {
                // In the data view, the model:
                //    <bracketOption id="123" value="text" optedState="OPTED_IN">
                //
                // corresponds to:
                //    <span class="bracketOption" data-id="123" opted-state="OPTED_IN">text</span>
                const span = viewWriter.createContainerElement('span', {
                    class: 'bracket-option',
                    'data-id': modelElement.getAttribute('id'),
                    'data-opted-state': modelElement.getAttribute('optedState')
                });
                const innerText = viewWriter.createText(modelElement.getAttribute('value'));
                viewWriter.insert(viewWriter.createPositionAt(span, 0), innerText);
                return span;
            }
        });

        // <bracketOption> convert model to editing view
        conversion.for('editingDowncast').elementToElement({
            model: 'bracketOption',
            view: (modelElement, { writer: viewWriter }) => {
                // In the editing view, the model <bracketOption> corresponds to:
                //
                // <span class="bracket-option" data-id="...">
                //     <span class="bracket-option__react-wrapper">
                //         <BracketOption /> (React component)
                //     </span>
                // </span>
                const id = modelElement.getAttribute('id')
                const value = modelElement.getAttribute('value')
                const optedState = modelElement.getAttribute('optedState')

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
                    renderBracketOption(id, value, optedState, (newState) => {
                        model.change(writer => {
                            writer.setAttribute('optedState', newState, modelElement)
                        })
                        console.log(newState)
                    }, domElement);
                })

                viewWriter.insert(viewWriter.createPositionAt(span, 0), reactWrapper)

                return toWidget(span, viewWriter, { label: 'bracket option widget' })
            }
        });
    }
}