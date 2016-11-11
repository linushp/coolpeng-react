import React, {PropTypes} from 'react';
import createReubibiComponent from '../config/createReubibiComponent';
import UserStore from '../stores/UserStore';


class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    componentDidMount() {
        var that = this;
        var {actions} = that.props;
        actions.getUserList(1234);
        actions.getPostList('absdf', 'sdf');
        setTimeout(function () {

            //直接访问Store中的数据
            var userInfo = UserStore.getUserInfo(121);
            that.setState({userInfo: userInfo});
        }, 3000)
    }



    render() {
        var userList = this.props.userList || [];
        var postList = this.props.postList || [];
        var userInfo = this.state.userInfo || {};

        return (
            <div>
                {userInfo.name}
                <br/>
                {userList.map(function (x) {
                    return <div>{x}</div>
                })}
                <hr/>
                {postList.map(function (x) {
                    return <div>{x}</div>
                })}
            </div>
        );

    }

}


export default createReubibiComponent(Hello, {

    actions: {
        getUserList: 'user.getUserList',
        getPostList: 'post.getPostList'
    },

    props: {
        userList: 'user.userList',
        postList: 'user.postList'
    }

});