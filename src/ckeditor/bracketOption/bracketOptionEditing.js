import { Plugin } from 'ckeditor5'
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from 'ckeditor5';

import ToggleBracketOptionCommand from './toggleBracketOptionCommand'
import { reRunConverters } from '../utils';
import modifyBracketOptionValueCommand from './modifyBracketOptionValueCommand';

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
            const value = suggestion.getFirstRange()?.start?.nodeAfter?.getAttribute('value');
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
                'value', // content of bracket option (text for now; TODO allow composite content including units-of-measure)
                'optedState' // 'undecided', 'optedIn', or 'optedOut'
            ]
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
                return modelWriter.createElement('bracketOption',
                    {
                        id: viewElement.getAttribute('data-id'), // read custom attributes ("data-" prefix) from our span
                        value: viewElement.getChild(0).data, // read the text content of the span
                        optedState: viewElement.getAttribute('data-opted-state'),
                        isEditable: viewElement.getAttribute('data-editable') === 'true',
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
                    'data-opted-state': modelElement.getAttribute('optedState'),
                    'data-editable': modelElement.getAttribute('isEditable') === true ? 'true' : 'false',
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
                    renderBracketOption(id, value, optedState, isEditable, (newState) => {
                        editor.execute('toggleBracketOption', { bracketOptionId: id, newState })
                    }, domElement);
                })

                viewWriter.insert(viewWriter.createPositionAt(span, 0), reactWrapper)

                return toWidget(span, viewWriter, { label: 'bracket option widget' })
            }
        });
    }
}