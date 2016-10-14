import Dialog from '../../../components/dialog/Dialog';
import {createUUID,isEmpty,getStaticImages,StringUtils,StaticConfig} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import './UserInfoDialog.less';
class UserInfoDialog extends PureRenderComponent{
    constructor(props) {
        super(props);
    }


    render(){
        var userInfo = this.props.userInfo;
        var bg = getStaticImages('bg_user_info_bg.jpg');
        var bgStyle = {
            "background":"url('"+bg+"')"
        };
        var avatar = userInfo.avatar;
        if(!avatar){
            avatar = StaticConfig.DEFAULT_AVATAR;
        }
        return (
            <div className="UserInfoDialog">
                <div className="bg_user_info_bg" style={bgStyle}>
                    <div className="blank1"></div>
                    <img className="avatar" src={avatar} />
                    <div className="nickname"> {userInfo.nickname}</div>
                    <div className="lastloginTime">
                        <span>登录时间</span>
                        {StringUtils.toPrettyString(userInfo.lastLoginTime)}
                    </div>
                </div>
                <div className="radio-mask"></div>
                <div className="content">

                    <div className="contentItem">
                        <div className="key">用户名</div>
                        <div className="value">{userInfo.username}</div>
                    </div>

                    <div className="contentItem">
                        <div className="key">邮箱</div>
                        <div className="value">{userInfo.mail}</div>
                    </div>

                    <div className="contentItem">
                        <div className="key">位置</div>
                        <div className="value">{userInfo.lastLoginIpStr}</div>
                    </div>

                    <div className="contentItem">
                        <div className="key">活跃</div>
                        <div className="value">{userInfo.viewCount}</div>
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        );
    }

}


export function showUserInfoDialog(userInfo){

    var popStyle = {
        width: 352,
        height: 350
    };
    var popClass = "dialogs-UserInfoDialog";
    var buttons = [
        {text: '关闭', name: 'cancel', cls: '', action: 'close'}
    ];

    function callback(btn, d, doCloseDialog) {
        var name = btn.name;
        if (name == 'ok' || name === 'cancel' || name === 'onClickDialogMask') {
            doCloseDialog();
        }
    }

    window.setTimeout(function(){
        //content,callback,title, buttons, popStyle, popClass,closeControl
        Dialog.showModal(<UserInfoDialog userInfo={userInfo}/>, callback, "个人资料", buttons, popStyle, popClass, true);
    },0);
}