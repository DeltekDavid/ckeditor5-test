import ContextBase from '@ckeditor/ckeditor5-core/src/context';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import BaseClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

import UnitsOfMeasure from '../ckeditor/unitsOfMeasure/unitsOfMeasure';
import { default as BracketOptionPlugin } from '../ckeditor/bracketOption/bracketOption';


class Context extends ContextBase { }

Context.defaultConfig = {
    language: 'en',
};

Context.builtinPlugins = [
    CloudServices,
    PresenceList,
];

class ClassicEditor extends BaseClassicEditor { }

ClassicEditor.builtinPlugins = [
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

ClassicEditor.defaultConfig = {
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

export default { Context, ClassicEditor };