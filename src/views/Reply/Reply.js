/**
 * <Reply pageId={'BLOG_POST_ID_'+post.id} onReplySuccess={}></Reply>
 * <Reply pageId={'PAGE_MOVIE'} ></Reply>
 */
import api from '../../api';
import React, { PropTypes } from 'react';

const EMP_ARRAY = [];

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageId: null,
            pageSize: 20,
            pageNo: 1,
            replyList: []
        };
    }

    queryReplyList() {

    }

    componentWillMount() {
        var pageId = this.props.pageId;
        this.setState({pageId: pageId,pageNo:1});
        this.queryReplyList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageId != this.state.pageId) {
            this.setState({pageId: nextProps.pageId,pageNo:1});
            this.queryReplyList();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        var pid1 = nextProps.pageId;
        var pid2 = this.props.pageId;
        var replyList1 = this.state.replyList || EMP_ARRAY;
        var replyList2 = nextState.replyList || EMP_ARRAY;
        return (pid1 !== pid2) || (replyList1 !== replyList2);
    }


    render() {
        return (
            <div>

            </div>
        );
    }


}