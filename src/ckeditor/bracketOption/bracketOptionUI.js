import { Plugin } from 'ckeditor5'
import {
    ContextualBalloon,
    clickOutsideHandler,
    ClickObserver
} from 'ckeditor5';

import { getItemByName } from '../utils';
import BracketOptionFormView from './bracketOptionFormView';

export default class BracketOptionUI extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        // Create the balloon and the form view.
        const editor = this.editor;
        this._balloon = editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        const view = this.editor.editing.view;
        const viewDocument = view.document;

        view.addObserver(ClickObserver);

        // Show UI when user clicks a fill-in-the-blank bracketOption element.
        this.editor.listenTo(viewDocument, 'click', (evt, data) => {
            const range = editor.model?.document?.selection?.getFirstRange()
            const selectedOption = range ? getItemByName(range, 'bracketOption') : null;
            if (selectedOption?.getAttribute('isEditable') === true
                && selectedOption.getAttribute('optedState') === 'OPTED_IN') {
                // Select the bracketOption element.
                this.editor.model.change(writer => {
                    writer.setSelection(writer.createPositionAt(selectedOption, 0));
                });

                this._showUI();
            }
        });

        console.log('BracketOptionUI was initialized')
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new BracketOptionFormView(editor.locale);

        this.listenTo(formView, 'submit', () => {
            const optionText = formView.bracketOptionInputView.fieldView.element.value;

            // Check for a bracket option at cursor position
            const range = editor.model.document.selection?.getFirstRange()
            const selectedOption = range ? getItemByName(range, 'bracketOption') : null;
            if (selectedOption) {
                editor.execute('modifySelectedBracketOptionValue', optionText);
            } else {
                // TODO create new bracketOption once we implement "create bracketOption" command
            }

            // Hide the form view after submit.
            this._hideUI();
        });

        // Hide the form view after clicking the "Cancel" button.
        this.listenTo(formView, 'cancel', () => {
            this._hideUI();
        });

        // Hide the form view when clicking outside the balloon.
        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI()
        });

        return formView;
    }

    _hideUI() {
        this.formView.bracketOptionInputView.fieldView.value = '';
        this.formView.element.reset();

        this._balloon.remove(this.formView);

        // Focus the editing view after closing the form view.
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        let target = null;

        // Set a target position by converting view selection range to DOM.
        target = () => view.domConverter.viewRangeToDom(
            viewDocument.selection.getFirstRange()
        );

        return {
            target
        };
    }

    _showUI() {
        // If an existing bracketOption is selected, populate the form with its value.
        const range = this.editor.model.document.selection?.getFirstRange()
        if (range) {
            const bracketOption = getItemByName(range, 'bracketOption');
            if (bracketOption) {
                this.formView.bracketOptionInputView.fieldView.value = bracketOption.getAttribute('value');
            }
        }

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        this.formView.focus();
        this.formView.bracketOptionInputView.fieldView.element.select(); // select all text in input
    }
}