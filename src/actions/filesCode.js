import CloudRestAction from '../core/CloudRestAction';


var funcNameList = [
    'saveCloudCode',
    'getCloudCodeById'
];

var prefix = "filesCode";

var restAction = new CloudRestAction(prefix,funcNameList);

export default restAction;