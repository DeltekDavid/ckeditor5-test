import { Plugin } from '@ckeditor/ckeditor5-core';
import {
    ButtonView,
    ContextualBalloon,
    clickOutsideHandler,
    addListToDropdown,
    createDropdown,
    ViewModel
} from '@ckeditor/ckeditor5-ui';
import { Collection } from '@ckeditor/ckeditor5-utils';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import FormView from './unitsOfMeasureFormView';

import { getItemByName, reRunConverters } from '../utils';

export default class UnitsOfMeasureUI extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;

        // Create the balloon and the form view.
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        // Define config controlling visibility of units types.
        editor.config.define('showUnits', {
            imperial: true,
            metric: true,
        });

        // Create a drop-down with switches to toggle visibility of imperial and metric units.
        editor.ui.componentFactory.add('showUnits', (locale) => {
            const showUnitsConfig = editor.config.get('showUnits');
            const collection = new Collection();
            collection.add({
                type: 'switchbutton',
                model: new ViewModel({
                    label: 'Imperial',
                    withText: true,
                    isOn: showUnitsConfig?.imperial,
                }),
            });
            collection.add({
                type: 'switchbutton',
                model: new ViewModel({
                    label: 'Metric',
                    withText: true,
                    isOn: showUnitsConfig?.metric,
                })
            });

            const listDropdown = createDropdown(locale);
            listDropdown.buttonView.set({
                label: 'Show Units',
                withText: true
            });
            // Respond to clicks on the switch buttons.
            this.listenTo(listDropdown, 'execute', evt => {
                const newIsOn = !evt.source.isOn;
                // Prevent user from disabling both units types.
                const unitsConfig = editor.config.get('showUnits');
                if (!newIsOn &&
                    ((evt.source.label === 'Imperial' && !unitsConfig.metric)
                        || (evt.source.label === 'Metric' && !unitsConfig.imperial))) {
                    return;
                }

                // Toggle the visibility of the selected units type.
                if (evt.source.label === 'Imperial') {
                    editor.config.set('showUnits.imperial', newIsOn);
                    evt.source.isOn = newIsOn;
                } else if (evt.source.label === 'Metric') {
                    editor.config.set('showUnits.metric', newIsOn);
                    evt.source.isOn = newIsOn;
                }

                // Update units to reflect new options.
                reRunConverters(editor);
            });

            addListToDropdown(listDropdown, collection);

            return listDropdown;
        });

        editor.ui.componentFactory.add('unitsOfMeasure', () => {
            // A component factory callback that creates a button.
            const button = new ButtonView();

            button.label = 'Insert Units';
            button.tooltip = true;
            button.withText = true;

            // Show the UI on button click.
            this.listenTo(button, 'execute', () => {
                this._showUI();
            });


            return button;
        });

        const view = this.editor.editing.view;
        const viewDocument = view.document;

        view.addObserver(ClickObserver);

        // Show UI when user clicks a unitsOfMeasure element.
        this.editor.listenTo(viewDocument, 'click', (evt, data) => {
            const modelElement = this.editor.editing.mapper.toModelElement(data.target?.parent);
            if (modelElement?.name === 'unitsOfMeasure') {
                // Select the unitsOfMeasure element.
                this.editor.model.change(writer => {
                    writer.setSelection(writer.createPositionAt(modelElement, 0));
                });

                this._showUI();
            }
        });
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView(editor.locale);

        this.listenTo(formView, 'submit', () => {
            const imperial = formView.imperialInputView.fieldView.element.value;
            const metric = formView.metricInputView.fieldView.element.value;

            // Check for a units at cursor position so we know whether
            // to create a new units or modify the selected one.
            const range = editor.model.document.selection?.getFirstRange()
            const selectedUnits = range ? getItemByName(range, 'unitsOfMeasure') : null;
            if (selectedUnits) {
                editor.execute('modifySelectedUnitsOfMeasure', { imperial, metric });
            } else {
                editor.execute('createUnitsOfMeasure', { imperial, metric });
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
        this.formView.metricInputView.fieldView.value = '';
        this.formView.imperialInputView.fieldView.value = '';
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
        // If an existing unitsOfMeasure is selected, populate the form with its values.
        const range = this.editor.model.document.selection?.getFirstRange()
        if (range) {
            const unitsItem = getItemByName(range, 'unitsOfMeasure');
            if (unitsItem) {
                this.formView.metricInputView.fieldView.value = unitsItem.getAttribute('metric');
                this.formView.imperialInputView.fieldView.value = unitsItem.getAttribute('imperial');
            }
        }

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        this.formView.focus();
    }
}