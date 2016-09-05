import CloudRestAction from '../core/CloudRestAction';


var staticFunc = [
    "staticCreateNoteCategory",
    "staticUpdateNoteCategory",
    "staticClearNoteStore"
];

var funcNameList = [
    'getNoteCategory',
    'getNoteListByCategory',
    'getNoteByIdWithReply',
    'saveOrUpdateNote',
    'saveOrUpdateNoteReply',
    'saveOrUpdateNoteCategory',
    'deleteNoteCategory',
    'deleteNote',
    'deleteNoteReply'
];

var prefix = "note";
var actions = new CloudRestAction(prefix,funcNameList,staticFunc);
export default actions;