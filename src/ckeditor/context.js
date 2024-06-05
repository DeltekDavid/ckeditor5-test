import { ClassicEditor, Context, Essentials, Bold, Italic, Paragraph, CloudServices, Table, TableProperties, TableCellProperties, TableToolbar, ContextWatchdog } from 'ckeditor5';

import { Comments, TrackChanges, RealTimeCollaborativeTrackChanges, RealTimeCollaborativeComments, PresenceList } from 'ckeditor5-premium-features';

import UnitsOfMeasure from '../ckeditor/unitsOfMeasure/unitsOfMeasure';
import BracketOptionPlugin from '../ckeditor/bracketOption/bracketOption';
import { EnablePremiumFeatures } from '../constants';


class OurContext extends Context { }

OurContext.defaultConfig = {
    language: 'en',
};

OurContext.builtinPlugins = EnablePremiumFeatures ? [
    CloudServices,
    PresenceList,
] : [];

class OurClassicEditor extends ClassicEditor { }

OurClassicEditor.builtinPlugins = EnablePremiumFeatures ? [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    Table,
    TableProperties,
    TableCellProperties,
    TableToolbar,
    TrackChanges,
    Comments,
    RealTimeCollaborativeComments,
    RealTimeCollaborativeTrackChanges,
    UnitsOfMeasure,
    BracketOptionPlugin
] : [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    Table,
    TableProperties,
    TableCellProperties,
    TableToolbar,
    UnitsOfMeasure,
    BracketOptionPlugin
];

OurClassicEditor.defaultConfig = {
    toolbar: EnablePremiumFeatures ? [
        'undo',
        'redo',
        '|',
        'trackChanges',
        '|',
        'showUnits',
        'unitsOfMeasure',
    ] : [
        'undo',
        'redo',
        '|',
        'showUnits',
        'unitsOfMeasure',
    ],
};

export default { OurContext, OurClassicEditor, ContextWatchdog };