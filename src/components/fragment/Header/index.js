import React from 'react'
import './index.less'
import {Link} from 'react-router'
import Icon from '../../icons/Icon';
import Dialog from '../../dialog/Dialog';
import {toUserInfoEditingView} from './UserInfoView';

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }


    showUserInfo(){

        const {user,updateUserInfo} = this.props;
        var userInfo = user.userInfo;

        var view = toUserInfoEditingView(userInfo);
        var content = (
            <div dangerouslySetInnerHTML={{__html:view.html}}></div>
        );
        var callback = function(btn,dialog,doCloseDialog){

            if(btn.name==='ok'){
                var values = view.getInputValue();
                updateUserInfo({
                    id:userInfo.id,
                    UserEntity:values
                },function(){
                    Dialog.showMsgSuccess("修改成功");
                });
            }else {
                doCloseDialog();
            }
        };

        var popStyle = {
            width:600,
            height:400
        };

        var buttons = [
            {text: '修改', name:'ok', cls: 'primary', action: 'close'},
            {text: '关闭', name:'cancel', cls: '', action: 'close'}
        ];

        //content,callback,title, buttons, popStyle, popClass,closeControl
        Dialog.showModal(content,callback,"个人资料设置",buttons,popStyle,null,true);
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
