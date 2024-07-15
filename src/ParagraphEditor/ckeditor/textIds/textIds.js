import { Plugin } from 'ckeditor5';

/** 
 * Plugin to add data-id attribute to text elements.
 * Plain text elements in the input get converted to span elements so we can add the data-id attribute.
 */
export default class TextIds extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
    }

    _defineSchema() {
        const editor = this.editor
        editor.model.schema.extend('$text', {
            allowAttributes: 'id'
        });
    }

    _defineConverters() {
        const editor = this.editor
        editor.conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                classes: 'paragraph-text'
            },
            model: {
                key: 'id',
                name: '$text',
                value: viewElement => viewElement.getAttribute('data-id')
            }
        });

        editor.conversion.for('downcast').attributeToElement({
            model: 'id',
            view: (attributeValue, { writer: viewWriter }) => {
                console.log(attributeValue);
                return viewWriter.createAttributeElement(
                    'span',
                    {
                        class: 'paragraph-text',
                        'data-id': attributeValue
                    });
            }
        });
    }
}