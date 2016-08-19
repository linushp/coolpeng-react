import CloudRestAction from '../core/CloudRestAction';


var staticFunc = [
    "changeSearchText"
];

var funcNameList = [
    'getNoteCategory',
    'getNoteListByCategory',
    'getNoteById',
    'saveOrUpdateNote',
    'deleteNote'
];

var prefix = "note";
var actions = new CloudRestAction(prefix,funcNameList,staticFunc);
export default actions;