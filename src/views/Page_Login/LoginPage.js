import React from 'react';
import RebixFlux from 'react-rebixflux';
import {showStyle} from 'rebix-utils';
import LoginStore from '../../stores/LoginStore';
import {encodePassword} from '../../utils/CryptUtils';
import getRandomNumString from '../../functions/getRandomNumString';
import getFormValues from '../../functions/getFormValues';
import SocketManager from '../../api/socket/SocketManager';
import LoginActions from '../../actions/LoginActions';
import './LoginPage.less';


var UserRegister = RebixFlux.createPureComponent(function (props) {
    var {actions} = props;
    return (
        <div className="login-page-register">
            <div className="login-box">
                <div className="login-title">新用户注册</div>
                <div className="login-form">
                    <form onSubmit={actions.handleRegSubmit}>
                        <input type="text" placeholder="邮箱" name="email"/>
                        <input type="text" placeholder="昵称" name="nickname"/>
                        <input type="password" placeholder="密码" name="password"/>
                        <input type="submit" className="loginButton" value="注册" name="button"/>
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

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            currentView: 'login'
        };
    }

    componentDidMount() {
        SocketManager.openUnauthWebSocket();
    }

    goToLogin = ()=> {
        this.setState({currentView: "login"});
    };

    goToReg = ()=> {
        this.setState({currentView: "register"});
    };

    handleRegSubmit = (e)=> {
        var values = getFormValues(e.target, ['email', 'nickname', 'password']);
        values['password'] = encodePassword(values['password']);
        LoginActions.addUserAccount(values).then(function (result) {
            if (result === 'email_exist') {
                alert("此邮箱已存在,不能注册")
            } else {
                alert("注册成功");
            }
        });
        e.preventDefault();
        return false;
    };


    handleLoginSubmit = (e)=> {
        var that = this;
        var values = getFormValues(e.target, ['email', 'password']);
        values['password'] = encodePassword(values['password']);
        LoginActions.doLogin(values).then(function(result){
            alert("登录成功");
            that.context.router.push('/');
        },function(){
            alert("登录失败")
        });
        e.preventDefault();
        return false;
    };

    render() {

        var that = this;
        var {currentView} = that.state;
        var actions = that;
        return (
            <div className="login-page" style={style}>
                <div className="login-box" style={showStyle(currentView==='login')}>
                    <div className="login-title">UBIBI</div>
                    <div className="login-form">
                        <form onSubmit={actions.handleLoginSubmit}>
                            <input type="text" placeholder="登录邮箱" name="email"/>
                            <input type="password" placeholder="登录密码" name="password"/>
                            <input type="submit" className="loginButton" value="登录" name="button"/>
                        </form>
                    </div>
                    <div className="register" onClick={that.goToReg}>注册账号</div>
                </div>
                <div className="login-page-register" style={showStyle(currentView==='register')}>
                    <UserRegister actions={that}/>
                </div>
            </div>
        );
    }
}

export default RebixFlux.connect(LoginPage, LoginStore, function (loginStore) {
    return {};
});