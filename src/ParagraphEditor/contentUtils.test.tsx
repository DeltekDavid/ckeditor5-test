import { OptionItemState, TextContentElement } from "@deltek/specification-client/core/Models/textContentElement";
import { elementsToEditorParagraph } from "./contentUtils";

describe("elementsToEditorParagraph", () => {
    it.each([
        // Normal text
        [
            [{
                id: "id_text",
                type: "Text",
                text: "Hello World",
                isOptionItem: false,
                imperialUnits: "",
                metricUnits: "",
                fieldId: "",
                elements: [],
                optionItemState: null,
                hyperlinkUrl: "",
                placeholderText: "",
                changeType: null,
                authoredUserId: "",
            }],
            "<p><span class='paragraph-text' data-id='id_text'>Hello World</span></p>",
        ],

        // Hyperlink
        [
            [{
                id: "id_hyperlink",
                type: "Hyperlink",
                text: "GitHub",
                hyperlinkUrl: "https://github.com",
                isOptionItem: false,
                imperialUnits: "",
                metricUnits: "",
                fieldId: "",
                elements: [],
                optionItemState: null,
                placeholderText: "",
                changeType: null,
                authoredUserId: ""
            }],
            "<p><a href='https://github.com' data-id='id_hyperlink'>GitHub</a></p>",
        ],

        // Units of measure
        [
            [{
                id: "id_units_of_measure",
                type: "UnitsOfMeasure",
                imperialUnits: "lbs",
                metricUnits: "kg",
                isOptionItem: false,
                fieldId: "",
                text: "",
                elements: [],
                optionItemState: null,
                hyperlinkUrl: "",
                placeholderText: "",
                changeType: null,
                authoredUserId: ""
            }],
            "<p><span class='units-of-measure' data-id='id_units_of_measure'><span class='imperial'>lbs</span><span class='metric'>kg</span></span></p>",
        ],

        // Unknown type
        [
            [{
                id: "id_unknown",
                type: "Unknown",
                text: "Unknown type",
                isOptionItem: false,
                fieldId: "",
                elements: [],
                optionItemState: null,
                hyperlinkUrl: "",
                placeholderText: "",
                changeType: null,
                authoredUserId: "",
                imperialUnits: "",
                metricUnits: "",
            }],
            "<p></p>",
        ],

        // Undecided option
        [
            [{
                id: 'id_option',
                type: 'SelectionOption',
                text: 'option 1',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: null,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='UNDECIDED' data-editable='false'>option 1</span></p>",
        ],

        // Opted-in option
        [
            [{
                id: 'id_option',
                type: 'SelectionOption',
                text: 'option 1',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'OptedIn' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_IN' data-editable='false'>option 1</span></p>",
        ],

        // Opted-out option
        [
            [{
                id: 'id_option',
                type: 'SelectionOption',
                text: 'option 1',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'OptedOut' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_OUT' data-editable='false'>option 1</span></p>",
        ],

        // Inactive option
        [
            [{
                id: 'id_option',
                type: 'SelectionOption',
                text: 'option 1',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'InActive' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_OUT' data-editable='false'>option 1</span></p>",
        ],

        // Undecided replacement (fill-in-the-blank) option
        [
            [{
                id: 'id_option',
                type: 'ReplacementOption',
                text: 'custom value',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: null,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='UNDECIDED' data-editable='true'>custom value</span></p>",
        ],

        // Opted-in replacement option
        [
            [{
                id: 'id_option',
                type: 'ReplacementOption',
                text: 'custom value',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'OptedIn' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_IN' data-editable='true'>custom value</span></p>",
        ],

        // Opted-out replacement option
        [
            [{
                id: 'id_option',
                type: 'ReplacementOption',
                text: 'custom value',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'OptedOut' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_OUT' data-editable='true'>custom value</span></p>",
        ],

        // Inactive replacement option
        [
            [{
                id: 'id_option',
                type: 'ReplacementOption',
                text: 'custom value',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [],
                optionItemState: 'InActive' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_OUT' data-editable='true'>custom value</span></p>",
        ],

        // Option item group, two options with a space between them
        [
            [{
                id: 'id_option_group',
                type: 'OptionGroup',
                text: '',
                isOptionItem: false,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [
                    {
                        id: 'id_option_1',
                        type: 'SelectionOption',
                        text: 'option 1',
                        isOptionItem: true,
                        imperialUnits: '',
                        metricUnits: '',
                        hyperlinkUrl: '',
                        fieldId: '',
                        elements: [],
                        optionItemState: null,
                        placeholderText: '',
                        changeType: null,
                        authoredUserId: '',
                    },
                    {
                        id: "id_space",
                        type: "Text",
                        text: " ",
                        isOptionItem: false,
                        imperialUnits: "",
                        metricUnits: "",
                        fieldId: "",
                        elements: [],
                        optionItemState: null,
                        hyperlinkUrl: "",
                        placeholderText: "",
                        changeType: null,
                        authoredUserId: "",
                    },
                    {
                        id: 'id_option_2',
                        type: 'ReplacementOption',
                        text: 'custom value',
                        isOptionItem: true,
                        imperialUnits: '',
                        metricUnits: '',
                        hyperlinkUrl: '',
                        fieldId: '',
                        elements: [],
                        optionItemState: null,
                        placeholderText: '',
                        changeType: null,
                        authoredUserId: '',
                    },
                ],
                optionItemState: null,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option_1' data-option-group-id='id_option_group' data-opted-state='UNDECIDED' data-editable='false'>option 1</span><span class='paragraph-text' data-id='id_space' data-option-group-id='id_option_group'> </span><span class='bracket-option' data-id='id_option_2' data-option-group-id='id_option_group' data-opted-state='UNDECIDED' data-editable='true'>custom value</span></p>",
        ],

        // Option item with nested units-of-measure and normal text
        [
            [{
                id: 'id_option',
                type: 'SelectionOption',
                text: '',
                isOptionItem: true,
                imperialUnits: '',
                metricUnits: '',
                hyperlinkUrl: '',
                fieldId: '',
                elements: [
                    {
                        id: 'id_nested_units_1',
                        type: 'UnitsOfMeasure',
                        imperialUnits: '1 lb',
                        metricUnits: '0.453592 kg',
                        isOptionItem: false,
                        fieldId: '',
                        text: '',
                        elements: [],
                        optionItemState: null,
                        hyperlinkUrl: '',
                        placeholderText: '',
                        changeType: null,
                        authoredUserId: '',
                    },
                    {
                        id: "id_nested_text",
                        type: "Text",
                        text: " to ",
                        isOptionItem: false,
                        imperialUnits: "",
                        metricUnits: "",
                        fieldId: "",
                        elements: [],
                        optionItemState: null,
                        hyperlinkUrl: "",
                        placeholderText: "",
                        changeType: null,
                        authoredUserId: "",
                    },
                    {
                        id: "id_nested_units_2",
                        type: "UnitsOfMeasure",
                        text: "",
                        isOptionItem: false,
                        imperialUnits: "3 lbs",
                        metricUnits: "1.36078 kg",
                        fieldId: "",
                        elements: [],
                        optionItemState: null,
                        hyperlinkUrl: "",
                        placeholderText: "",
                        changeType: null,
                        authoredUserId: "",
                    },
                ],
                optionItemState: 'OptedIn' as OptionItemState,
                placeholderText: '',
                changeType: null,
                authoredUserId: '',
            }],
            "<p><span class='bracket-option' data-id='id_option' data-opted-state='OPTED_IN' data-editable='false'><span class='nested-units-of-measure' data-id='id_nested_units_1'><span class='imperial'>1 lb</span><span class='metric'>0.453592 kg</span></span><span class='paragraph-text' data-id='id_nested_text'> to </span><span class='nested-units-of-measure' data-id='id_nested_units_2'><span class='imperial'>3 lbs</span><span class='metric'>1.36078 kg</span></span></span></p>"
        ]
    ])("returns the expected editor data for %p", (textContentElements: Partial<TextContentElement>[], expected: string) => {
        expect(elementsToEditorParagraph(textContentElements)).toEqual(expected);
    });
});