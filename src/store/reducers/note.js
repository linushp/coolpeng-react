import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import Immutable from 'immutable';
import {updateImmutableList,removeImmutableListObj} from '../../core/utils/index';

const initialState = Immutable.fromJS({

    //分类目录
    CategoryList: [],

    //文章列表
    NoteList: [],
    NoteListTotalCount: 0,
    NoteListPageSize: 0,
    NoteListPageNumber: 0,
    NoteListSearchTitleLike:'',

    //当前显示的文章
    NoteVO: null

});


export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "note",
    switchRestType: {

        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         * @returns {*}
         */
        'getNoteCategory': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var categoryList = Immutable.fromJS(res.data || {});
                state = state.set('CategoryList', categoryList);
            }
            return state;
        },


        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         * @returns {*}
         */
        'getNoteListByCategory': function (state, res, restState, meta) {

            state = state.set('NoteListSearchTitleLike',meta.reqData.titleLike || '');

            if (restState.isSuccess()) {
                var NoteList = Immutable.fromJS(res.data || []);
                state = state.set('NoteList', NoteList);
                state = state.set('NoteListPageSize', res.pageSize);
                state = state.set('NoteListTotalCount', res.totalCount);
                state = state.set('NoteListPageNumber', res.pageNo);
            }
            return state;
        },

        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         * @returns {*}
         */
        'getNoteByIdWithReply': function (state, res, restState, meta) {
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


        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         * @returns {*}
         */
        'saveOrUpdateNote': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                if(res.data){
                    var finder = ((v)=> v.get('id')===NoteVO.get('id'));
                    var NoteVO = Immutable.fromJS(res.data);
                    state = state.set('NoteVO', NoteVO);
                    state = updateImmutableList(state,'NoteList',finder,NoteVO);
                }else {
                    state = state.set('NoteVO', null);
                }
            }
            return state;
        },


        'saveOrUpdateNoteReply': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
            }
            return state;
        },

        'saveOrUpdateNoteCategory':function (state, res, restState, meta) {
            if (restState.isSuccess()) {
            }
            return state;
        },

        'deleteNoteCategory':function (state, res, restState, meta) {
            if (restState.isSuccess()) {
            }
            return state;
        },

        'deleteNoteReply':function (state, res, restState, meta) {
            if (restState.isSuccess()) {
            }
            return state;
        },

        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         * @returns {*}
         */
        'deleteNote': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var noteId = res.data;
                var finder = ((v)=> v.get('id')===noteId);
                state = removeImmutableListObj(state,'NoteList',finder);
            }
            return state;
        },


        /**
         *
         * @param state
         * @param res
         * @param restState
         * @param meta
         */
        changeSearchText:function(state, res, restState, meta){
            var data = res.data || '';
            state = state.set('NoteListSearchTitleLike',data);
            return state;
        }

    }
});
