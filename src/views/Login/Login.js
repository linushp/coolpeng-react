import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import PureRenderComponent from '../../core/PureRenderComponent';
import ReactForm from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';

import './index.less'

class Login extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
        };
        this.LoginFormLayout = [
            {name: 'username', type: 'input',placeholder:"请输入用户名",text:"用户名"},
            {name: 'password', type: 'input',placeholder:"请输入密码",text:"密码"}
        ];
    }

    componentWillMount() {
    }

    doLogin(){
        var values = this.getReactFormValues("LoginForm");
        var username = values["username"];
        var password = values["password"];
        var actions = this.props.actions;
        var that = this;
        actions.login(username, password, function (action,res) {
            if (res && res.responseCode === 0) {
                Dialog.showMsgSuccess("登录成功");
                that.context.router.push("/note/");
            }else {
                Dialog.showMsgSuccess(res && res.responseText);
            }
        });
    }

    render() {
        var actions = this.props.actions;
        var user = this.props.user || {};
        return (
            <div className="login-page">
                <ReactForm ref="LoginForm" layout={this.LoginFormLayout}></ReactForm>
                <button onClick={this.doLogin.bind(this)} className="loginButton">登录</button>
            </div>
        );
    }
}


Login.STATE_CONFIG = {
    user: 'user'
};

Login.ACTION_CONFIG = {
    setCurrentTempUser: 'user.setCurrentTempUser',
    "login":"user.login"
};


export default ActionStoreHelper()(Login);