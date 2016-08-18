import CloudRestAction from '../core/CloudRestAction';
var funcNameList = [
    'getNoteCategory',
    'getNoteListByCategory',
    'getNoteById',
    'saveOrUpdateNote',
    'deleteNote'
];
var prefix = "note";
var restAction = new CloudRestAction(prefix,funcNameList);
export default restAction;