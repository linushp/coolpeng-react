import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';

var initialState = immutable.fromJS({

});

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "filesCode",
    switchRestType: {
        'saveCloudCode': function (state, res, restState, meta) {
            return state;
        },
        'getCloudCodeById': function (state, res, restState, meta) {
            return state;
        }
    },
    switchType: {}
});