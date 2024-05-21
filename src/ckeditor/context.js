import { ClassicEditor, Context, Essentials, Bold, Italic, Paragraph, CloudServices } from 'ckeditor5';

import { Comments, TrackChanges, RealTimeCollaborativeTrackChanges, RealTimeCollaborativeComments, PresenceList } from 'ckeditor5-premium-features';

import UnitsOfMeasure from '../ckeditor/unitsOfMeasure/unitsOfMeasure';
import BracketOptionPlugin from '../ckeditor/bracketOption/bracketOption';


class OurContext extends Context { }

OurContext.defaultConfig = {
    language: 'en',
};

OurContext.builtinPlugins = [
    CloudServices,
    PresenceList,
];

class OurClassicEditor extends ClassicEditor { }

OurClassicEditor.builtinPlugins = [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    TrackChanges,
    Comments,
    RealTimeCollaborativeComments,
    RealTimeCollaborativeTrackChanges,
    UnitsOfMeasure,
    BracketOptionPlugin
]

OurClassicEditor.defaultConfig = {
    toolbar: [
        'undo',
        'redo',
        '|',
        'trackChanges',
        '|',
        'showUnits',
        'unitsOfMeasure',
    ]
};

export default { OurContext, OurClassicEditor };