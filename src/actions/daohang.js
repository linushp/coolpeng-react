import CloudRestAction from '../core/CloudRestAction';


var funcNameList = [
    'insertOrUpdateDhCategory',
    'insertOrUpdateDhItem',
    'deleteDhCategory',
    'deleteDhItem',
    'getCategoryList'
];

var prefix = "daohang";

var restAction = new CloudRestAction(prefix,funcNameList);

export default restAction;