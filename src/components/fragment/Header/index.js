import React from 'react'
import './index.less'
import {Link} from 'react-router'
import Icon from '../../icons/Icon';
import {showUserInfoDialog} from './UserInfoDialog';

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }


    showUserInfo(){
        const {user,updateUserInfo} = this.props;
        var userInfo = user.userInfo;
        showUserInfoDialog(userInfo,updateUserInfo);
    }

    renderRightLogin(){
        const {user} = this.props;
        var userInfo = user.userInfo;
        if(userInfo && user.isLogged){
            return (
                <div>
                    <div className="userSetting">
                        <Icon icon="cogs"></Icon>
                    </div>
                    <div className="userAvatar" title={userInfo.nickname}>
                        <img src={userInfo.avatar} alt={userInfo.nickname} onClick={this.showUserInfo.bind(this)} />
                    </div>
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
                            <Icon icon="make-group"></Icon>
                            <span className="text">ubibi</span>
                        </Link>
                    </h1>
                    {renderLink("/home","首页")}
                    {renderLink("/daohang","导航")}
                    {renderLink("/note/","随笔")}
                    <div className="float-r">
                        {this.renderRightLogin()}
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        )
    }
}
