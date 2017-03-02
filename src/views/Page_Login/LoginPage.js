import React from 'react';
import RebixFlux from 'react-rebixflux';
import {showStyle} from 'rebix-utils';
import LoginStore from '../../stores/LoginStore';
import getRandomNumString from '../../functions/getRandomNumString';
import getFormValues from '../../functions/getFormValues';
import MyWebSocket from '../../utils/MyWebSocket';
import UserRegActions from '../../actions/UserRegActions';
import './LoginPage.less';


var UserRegister = RebixFlux.createPureComponent(function(props){
    var {actions} = props;
    return (
            <div className="login-page-register">
                <div className="login-box">
                    <div className="login-title">新用户注册</div>
                    <div className="login-form">
                        <form onSubmit={actions.handleRegSubmit}>
                            <input type="text" placeholder="邮箱" name="mail"/>
                            <input type="text" placeholder="昵称" name="nickname"/>
                            <input type="password" placeholder="密码" name="password"/>
                            <input type="submit" className="loginButton" value="注册" name="button" />
                        </form>
                    </div>
                    <div className="register" onClick={actions.goToLogin}>返回登录</div>
                </div>
            </div>
    );
});


var num = getRandomNumString(1, 16, 4);
var style = {
    'backgroundImage': `url("http://image.coolpeng.cn/avatar/00backwall/B-${num}.jpg")`
};

class LoginPage extends RebixFlux.PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentView: 'login'
        };
    }

    componentDidMount(){
        MyWebSocket.openUnauthWebSocket();
    }

    goToLogin = ()=> {
        this.setState({currentView: "login"});
    };

    goToReg = ()=> {
        this.setState({currentView: "register"});
    };

    handleRegSubmit = (e,e2)=> {
        var values = getFormValues(e.target,['mail','nickname','password']);

        UserRegActions.c
        e.preventDefault();
        return false;
    };

    render(){

        var that = this;
        var {currentView} = that.state;
        return (
            <div className="login-page" style={style}>
                <div className="login-box" style={showStyle(currentView==='login')}>
                    <div className="login-title">UBIBI</div>
                    <div className="login-form">
                        <input type="text" placeholder="请输入用户名或邮箱" name="username"/>
                        <input type="password" placeholder="请输入密码" name="password"/>
                        <input type="submit" className="loginButton" value="登录" name="button" />
                    </div>
                    <div className="register" onClick={that.goToReg}>注册账号</div>
                </div>
                <div className="login-page-register" style={showStyle(currentView==='register')}>
                    <UserRegister actions={that} />
                </div>
            </div>
        );
    }
}

export default RebixFlux.connect(LoginPage,LoginStore,function(loginStore){
    return {};
});