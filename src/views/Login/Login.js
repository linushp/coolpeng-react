import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import PureRenderComponent from '../../core/PureRenderComponent';
import ReactForm,{getReactFormValues} from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';
import {getRandomNumString,uniqueId} from '../../core/utils/index';

import './index.less'


var num = getRandomNumString(1,16,4);
var style = {
    'backgroundImage':`url("http://image.coolpeng.cn/avatar/00backwall/B-${num}.jpg")`
};

class Login extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {

        };
        this.LoginFormLayout = [
            {name: 'username', type: 'input',placeholder:"请输入用户名"},
            {name: 'password', type: 'password',placeholder:"请输入密码",onEnterKey:this.doLogin.bind(this)},
            {name: 'button', type: 'button',placeholder:"登录",className:"loginButton",onClick:this.doLogin.bind(this)}
        ];
        this.reactFormUniqueId = uniqueId("reactFormUniqueId");
    }
    

    doLogin(){
        var values = getReactFormValues(this.reactFormUniqueId);
        var username = values["username"];
        var password = values["password"];
        var actions = this.props.actions;
        var that = this;
        actions.login(username, password, function (action,res) {
            if (res && res.responseCode === 0) {
                Dialog.showMsgSuccess("登录成功");
                actions.staticClearNoteStore();
                that.context.router.push("/note/");
            }else {
                Dialog.showMsgSuccess(res && res.responseText);
            }
        });
    }
    render() {
        let loggingIn = this.props.user.loggingIn;
        return (
            <div className="login-page" style={style}>
                <div className="login-box">
                    <div  className="login-title">登录系统</div>
                    <ReactForm id={this.reactFormUniqueId} layout={this.LoginFormLayout}></ReactForm>
                </div>
            </div>
        );
    }
}


Login.STATE_CONFIG = {
    user: 'user'
};

Login.ACTION_CONFIG = {
    "setCurrentTempUser": 'user.setCurrentTempUser',
    "login":"user.login",
    "staticClearNoteStore":'note.staticClearNoteStore'
};


export default ActionStoreHelper()(Login);