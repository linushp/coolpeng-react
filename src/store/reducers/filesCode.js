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
            if (restState.isSuccess()) {
                //var categoryList = state.get('categoryList');
                //categoryList = categoryList.push(immutable.fromJS(res.data || {}));
                //state = state.set('categoryList', categoryList);
            }
            return state;
        },
        'getCloudCodeById': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                //var newItem = immutable.fromJS(res.data || {});
                //return processDhItem(state, newItem, function (items, targetItem) {
                //    return items.push(targetItem);
                //});
            }
            return state;
        }
    },
    switchType: {}
});