import Dialog from '../../../../components/dialog/Dialog';
import $ from 'jquery';
import {toUserInfoEditingView} from './UserInfoView';
import {uniqueId} from '../../../../core/utils/index';
import {onXhrUpload} from '../../../../service/upload/UploadUtils';
//
//

export function showUserInfoDialog(userInfo,updateUserInfo){

    var onFileChangeName = uniqueId("UbibiShowUserInfoDialogOnFileChange");
    var view = toUserInfoEditingView(userInfo,onFileChangeName);
    var content = (
        <div dangerouslySetInnerHTML={{__html:view.html}}></div>
    );

    
    window[onFileChangeName] = function(e){
        var files = e.files;//FileList
        var file = files[0];
        onXhrUpload(file, function(a,b,c){
            var file_path = a.file_path;
            view.setAvatarUrl(file_path);
        }, function(){
            Dialog.showMsgError("上传失败");
        }, function(){
        });
    };

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
            delete window[onFileChangeName];
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