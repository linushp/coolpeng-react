import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';

var initialState = immutable.fromJS({
    filesCode: []
});

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "filesCode",
    switchRestType: {
        'saveCloudCode': function (state, res, restState, meta) {
            debugger;
            if (restState.isSuccess()) {
            }
            return state;
        },
        'getCloudCodeById': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
            }
            return state;
        }
    },
    switchType: {}
});