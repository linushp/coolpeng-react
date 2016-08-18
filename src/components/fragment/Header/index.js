import React from 'react'
import './index.less'
import {Link} from 'react-router'

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }



    renderRightLogin(){
        const {user} = this.props;
        var userInfo = user.userInfo;
        if(userInfo && user.isLogged){
            return (
                <div>
                    欢迎您:{userInfo.nickname}
                    &nbsp;<span onClick={this.props.onClickLogout}>退出</span>
                </div>
            );
        }
        return (
            <div>
                <span>注册</span>&nbsp;/&nbsp;
                <span onClick={this.props.onClickLogin}>登录</span>
            </div>);
    }

    render() {

        return (
            <div className='ant-layout-header'>

                <div className='page-content'>
                    <h1 className="my-logo float-l" >
                        <Link to="/home">
                            <span className="text">coolpeng</span>
                        </Link>
                    </h1>
                    <Link to="/home">
                        home
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="/daohang">
                        daohang
                    </Link>

                    &nbsp;&nbsp;&nbsp;
                    <Link to="/note/index">
                        Note
                    </Link>
                    <div className="float-l">
                    </div>
                    <div className="float-r login-btn">
                        {this.renderRightLogin()}
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        )
    }
}
