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
            </div>);
    }

    renderLink(link,text){

        var pathname = window.location.pathname;

        var selected = "";
        if(pathname.indexOf(link)===0){
            selected = ' selected'
        }

        return(
            <div className={`cp-header-menu-item ${selected}`}>
                <Link to={link}>{text} </Link>
            </div>
        );
    }

    render() {
        var renderLink = this.renderLink.bind(this);
        return (
            <div className='cp-layout-header'>

                <div className='page-content'>
                    <h1 className="my-logo float-l" >
                        <Link to="/home">
                            <span className="text">coolpeng</span>
                        </Link>
                    </h1>
                    {renderLink("/home","首页")}
                    {renderLink("/daohang","导航")}
                    {renderLink("/note/","随笔")}
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
