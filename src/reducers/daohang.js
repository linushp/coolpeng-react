import CreateCloudRestReducer from '../core/CreateCloudRestReducer';
import immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';

var initialState = immutable.Map({
    categoryList: []
});

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "daohang",
    switchRestType: {
        'insertOrUpdateDhCategory': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                var categoryList = state.get('categoryList');
                categoryList = categoryList.push(immutable.Map(res.data));
                state = state.set('categoryList',categoryList);
            }
            return state;
        },
        'insertOrUpdateDhItem': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                var categoryList = state.get('categoryList');
                var index = 0;
                var category = categoryList.find(function(c,i){
                     if(c.id===res.data.categoryId){
                         index = i;
                        return true;
                    }
                    return false;
                });

                var items = category.get('items') || immutable.List([]);
                items = items.push(res.data);
                category.set('items',items);
                categoryList = categoryList.set(index,category);
                state = state.set('categoryList',categoryList);
            }
            return state;
        },
        'deleteDhCategory': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                var categoryList = state.get('categoryList');
                categoryList = categoryList.filterNot(function(s){

                });
                state = state.set('categoryList',categoryList);
            }
            return state;
        },
        'deleteDhItem': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                var categoryList = state.get('categoryList');
                categoryList = categoryList.filterNot(function(s){

                });
                state = state.set('categoryList',categoryList);
            }
            return state;
        },
        'getCategoryList': function (state, res, restState, meta) {
            if(restState.isSuccess()){
                var categoryList = immutable.fromJS(res.data||[]);
                state = state.set('categoryList',categoryList);
            }
            return state;
        }
    },

    switchType: {}
});