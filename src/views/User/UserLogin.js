import React from 'react'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import PureRenderComponent from '../../core/PureRenderComponent';
import ReactForm,{getReactFormValues,createReactFormUniqueId} from '../../components/form/ReactForm';
import UserRegister from './UserRegister';
import Dialog from '../../components/dialog/Dialog';
import {getRandomNumString,uniqueId,JSXRenderUtils} from '../../core/utils/index';
import './index.less'
const showStyle = JSXRenderUtils.showStyle;

var num = getRandomNumString(1, 16, 4);
var style = {
    'backgroundImage': `url("http://image.coolpeng.cn/avatar/00backwall/B-${num}.jpg")`
};

class UserLogin extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        var that = this;
        that.state = {
            currentView: 'login'
        };

        that.reactFormUniqueId = createReactFormUniqueId();
        that.LoginFormLayout = [
            {name: 'username', type: 'input', placeholder: "请输入用户名或邮箱"},
            {name: 'password', type: 'password', placeholder: "请输入密码", onEnterKey: this.doLogin.bind(this)},
            {
                name: 'button',
                type: 'button',
                placeholder: "登录",
                className: "loginButton",
                onClick: this.doLogin.bind(this)
            }
        ];
    }


    doLogin() {
        var that = this;
        var values = getReactFormValues(that.reactFormUniqueId);
        var username = values["username"];
        var password = values["password"];
        var actions = that.props.actions;

        actions.login(username, password, function (action, res) {
            if (res && res.responseCode === 0) {
                Dialog.showMsgSuccess("登录成功");
                actions.staticClearNoteStore();
                that.context.router.push("/link");
            } else {
                Dialog.showMsgError(res && res.responseText);
            }
        });
    }


    onSwitchView(name) {
        this.setState({
            currentView: name
        });
    }

    render() {
        var that = this;
        let loggingIn = that.props.user.loggingIn;
        let actions = that.props.actions;
        var {currentView} = that.state;
        return (
            <div className="login-page" style={style}>
                <div className="login-box" style={showStyle(currentView==='login')}>
                    <div className="login-title">UBIBI 轻笔记</div>
                    <ReactForm id={this.reactFormUniqueId} layout={this.LoginFormLayout}></ReactForm>
                    <div className="register" onClick={that.onSwitchView.bind(that,'register')}>注册账号</div>
                </div>
                <div className="login-page-register" style={showStyle(currentView==='register')}>
                    <UserRegister actions={actions} onSwitchView={that.onSwitchView.bind(that,'login')}/>
                </div>
            </div>
        );
    }
}


UserLogin.STATE_CONFIG = {
    user: 'user'
};

UserLogin.ACTION_CONFIG = {
    "login": "user.login",
    "register": "user.register",
    "setCurrentTempUser": 'user.setCurrentTempUser',
    "staticClearNoteStore": 'note.staticClearNoteStore'
};


export default ActionStoreHelper()(UserLogin);