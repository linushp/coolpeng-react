import React from 'react'
import './index.less'
import {Link} from 'react-router'
import Icon from '../../../../components/icons/Icon';
import {showUserInfoDialog} from './UserInfoDialog';
import PopupOperation from '../../../../components/PopupOperation/PopupOperation';

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }


    showUserInfo() {
        const {user,updateUserInfo} = this.props;
        var userInfo = user.userInfo;
        showUserInfoDialog(userInfo, updateUserInfo);
    }

    userAvatarPop(that) {
        var data = [
            {
                text: '个人资料设置',
                onClick: function () {
                    that.showUserInfo();
                }
            },
            {
                text: '退出',
                onClick: function () {
                    const {onClickLogout} = that.props;
                    onClickLogout();
                }
            }
        ];
        return data;
    }

    renderRightLogin() {
        const {user} = this.props;
        var userInfo = user.userInfo;
        if (userInfo && user.isLogged) {
            return (
                <div>
                    <div className="userSetting">
                        <Icon icon="cogs"></Icon>
                    </div>
                    <div className="userAvatar" title={userInfo.nickname}>
                        <PopupOperation btns={this.userAvatarPop(this)} positionY="15" positionX="-130">
                            <img src={userInfo.avatar} alt={userInfo.nickname}/>
                        </PopupOperation>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <span>注册</span>&nbsp;/&nbsp;
            </div>);
    }

    renderLink(link, text) {

        var pathname = window.location.pathname;

        var selected = "";
        if (pathname.indexOf(link) === 0) {
            selected = ' selected'
        }

        return (
            <div className={`cp-header-menu-item ${selected}`}>
                <Link to={link}>{text} </Link>
            </div>
        );
    }

    render() {
        //{renderLink("/home", "想法")}
        var renderLink = this.renderLink.bind(this);
        return (
            <div className='cp-layout-header'>

                <div className='page-content'>
                    <h1 className="my-logo float-l">
                        <Link to="/home">
                            <Icon icon="make-group"></Icon>
                            <span className="text">ubibi</span>
                        </Link>
                    </h1>
                    {renderLink("/link", "链接")}
                    {renderLink("/chat", "聊天")}
                    {renderLink("/note/", "笔记")}
                    <div className="float-r">
                        {this.renderRightLogin()}
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        )
    }
}
