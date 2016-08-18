import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';

var initialState = immutable.fromJS({
    categoryList: []
});


function processDhItem(state, targetItem, callback) {
    //var targetItem = immutable.fromJS(res.data || {});
    var categoryList = state.get('categoryList');
    var index = 0;
    var category = categoryList.find(function (c, i) {
        if (c.get('id') === targetItem.get('categoryId')) {
            index = i;
            return true;
        }
        return false;
    });
    var items = category.get('items') || immutable.List([]);

    //items = items.push(targetItem);
    items = callback(items, targetItem);

    var category1 = category.set('items', items);
    var categoryList1 = categoryList.set(index, category1);
    var state111 = state.set('categoryList', categoryList1);
    return state111;
}

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "daohang",
    switchRestType: {
        'insertOrUpdateDhCategory': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                //var categoryList = state.get('categoryList');
                //categoryList = categoryList.push(immutable.fromJS(res.data || {}));
                //state = state.set('categoryList', categoryList);
            }
            return state;
        },
        'insertOrUpdateDhItem': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                //var newItem = immutable.fromJS(res.data || {});
                //return processDhItem(state, newItem, function (items, targetItem) {
                //    return items.push(targetItem);
                //});
            }
            return state;
        },
        'deleteDhCategory': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                // var targetCategory = immutable.fromJS(meta.reqData || {});
                // var categoryList = state.get('categoryList');
                // categoryList = categoryList.filterNot(function (c) {
                //     return c.get('id') === targetCategory.get('id');
                // });
                // state = state.set('categoryList', categoryList);
            }
            return state;
        },
        'deleteDhItem': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var targetItem = immutable.fromJS(meta.reqData || {});
                return processDhItem(state, targetItem, function (items, targetItem) {
                    return items.filterNot(function (item) {
                        return item.get('id') === targetItem.get('id');
                    })
                });
            }
            return state;
        },
        'getCategoryList': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var categoryList = immutable.fromJS(res.data || []);
                state = state.set('categoryList', categoryList);
            }
            return state;
        }
    },

    switchType: {}
});