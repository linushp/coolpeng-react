import Reubibi from '../../reubibi/src/index';


export default Reubibi.createStore({

    initialState: {
        postList: []
    },

    'onGetPostList': function (state, action) {
        state = Object.assign({}, state);
        var postList = action.payload;
        state.postList = postList;
        return state;
    }


});

