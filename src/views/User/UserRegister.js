import React from 'react'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import PureRenderComponent from '../../core/PureRenderComponent';
import ReactForm,{getReactFormValues,createReactFormUniqueId} from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';
import {getRandomNumString,uniqueId} from '../../core/utils/index';

export default class UserRegister extends PureRenderComponent {


    constructor(props) {
        super(props);
        var that = this;
        that.state = {};

        that.reactFormUniqueId = createReactFormUniqueId();
        that.LoginFormLayout = [
            {name:'mail',type:'input',placeholder:"请输入邮箱"},
            {name: 'nickname', type: 'input', placeholder: "请输入昵称"},
            {name: 'password', type: 'password', placeholder: "请输入密码"},
            {name: 'password2', type: 'password', placeholder: "再次输入密码"},
            {
                name: 'button',
                type: 'button',
                placeholder: "注册",
                className: "loginButton",
                onClick: that.doRegister.bind(that)
            }
        ];
    }

    doRegister() {
        var that = this;

        var values = getReactFormValues(that.reactFormUniqueId);
        var username = values["username"];
        var password = values["password"];

        var {actions} = that.props;
        var register = actions.register;
        register(values,function(action,res){
            if (res && res.responseCode === 0) {
                Dialog.showMsgSuccess("注册成功,请登录!");
                setTimeout(function(){
                    that.props.onSwitchView();
                },500);
            } else {
                Dialog.showMsgError(res && res.responseText);
            }
        })
    }


    render() {
        var that = this;
        var onSwitchView = that.props.onSwitchView;
        return (
            <div className="login-page-register">
                <div className="login-box">
                    <div className="login-title">新用户注册</div>
                    <ReactForm id={this.reactFormUniqueId} layout={this.LoginFormLayout}></ReactForm>
                    <div className="register" onClick={onSwitchView}>返回登录</div>
                </div>
            </div>
        );
    }
}
