import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import Immutable from 'immutable';
import {removeImmutableListObj,updateImmutableObject} from '../../core/utils/index';

var Record = Immutable.Record;
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


var switchRestType = {

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
                var NoteList = state.get('NoteList');
                NoteList = updateImmutableObject(NoteList,finder,NoteVO);
                state = state.set('NoteList',NoteList);
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
        return switchRestType.getNoteCategory(state,res,restState,meta);
    },

    'deleteNoteCategory':function (state, res, restState, meta) {
        return switchRestType.getNoteCategory(state,res,restState,meta);
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
    staticCreateNoteCategory:function(state, res, restState, meta){
        var data = res.data || {};
        var inputItem = Immutable.fromJS(data);
        var parentId = data.parentId;
        if(!parentId){
            var categoryList = state.get('CategoryList');
            categoryList = categoryList.push(inputItem);
            state = state.set('CategoryList',categoryList);
            return state;
        }
        else {


            var finder = function(c){
                return c.get('id')===parentId;
            };

            var newValue = function(c){
                var children = c.get('children');
                if(!children){
                    children = Immutable.fromJS([]);
                }
                children = children.push(inputItem);
                return c.set('children',children);
            };

            var CategoryList = state.get('CategoryList');
            CategoryList = updateImmutableObject(CategoryList,finder,newValue);
            return state.set('CategoryList',CategoryList);


            //var finder = function(c){
            //    return c.get('id')===parentId;
            //};
            //var categoryList = state.get('CategoryList');
            //var index = categoryList.findIndex(finder);
            //var parentCategory = categoryList.find(finder);
            //var children = parentCategory.get('children');
            //if(!children){
            //    children = Immutable.fromJS([]);
            //}
            //children = children.push(inputItem)
            //parentCategory = parentCategory.set('children',children);
            //categoryList = categoryList.set(index,parentCategory);
            //state = state.set('CategoryList',categoryList);
            //return state;
        }
    },


    /**
     * 修改分类的属性
     * @param state
     * @param res
     * @param restState
     * @param meta
     */
    'staticUpdateNoteCategory':function(state, res, restState, meta){
        var data = res.data || {};
        var finder = data.finder;
        var newValue = data.newValue;
        var CategoryList = state.get('CategoryList');
        CategoryList = updateImmutableObject(CategoryList,finder,newValue);
        return state.set('CategoryList',CategoryList);
    }

};

export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "note",
    switchRestType: switchRestType
});
