import CreateCloudRestReducer from '../core/CreateCloudRestReducer';

var initialState = {
    categoryList: []
};

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "daohang",
    switchRestType: {
        'insertOrUpdateDhCategory': function (state, res, restState, meta) {

        },
        'insertOrUpdateDhItem': function (state, res, restState, meta) {

        },
        'deleteDhCategory': function (state, res, restState, meta) {

        },
        'deleteDhItem': function (state, res, restState, meta) {

        },
        'getCategoryList': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                return Object.assign({},state,{categoryList:res.data})
            }
        }
    },

    switchType: {}
});