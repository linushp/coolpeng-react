import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({

    //分类目录
    CategoryList: [],

    //文章列表
    NoteList: [],
    NoteListTotalCount: 0,
    NoteListPageSize: 0,
    NoteListPageNumber: 0,

    //当前显示的文章
    NoteVO: null

});


export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "note",
    switchRestType: {
        'getNoteCategory': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var categoryList = Immutable.fromJS(res.data || {});
                state = state.set('CategoryList', categoryList);
            }
            return state;
        },
        'getNoteListByCategory': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var NoteList = Immutable.fromJS(res.data || []);
                state = state.set('NoteList', NoteList);
                state = state.set('NoteListPageSize', res.pageSize);
                state = state.set('NoteListTotalCount', res.totalCount);
                state = state.set('NoteListPageNumber', res.pageNo);
            }
            return state;
        },
        'getNoteById': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                if(res.data){
                    var NoteVO = Immutable.fromJS(res.data);
                    state = state.set('NoteVO', NoteVO);
                }else {
                    state = state.set('NoteVO', null);
                }
            }
            return state;
        },
        'saveOrUpdateNote': function (state, res, restState, meta) {
            if (restState.isSuccess()) {

            }
            return state;
        },
        'deleteNote': function (state, res, restState, meta) {
            if (restState.isSuccess()) {

            }
            return state;
        }
    },

    switchType: {}
});
