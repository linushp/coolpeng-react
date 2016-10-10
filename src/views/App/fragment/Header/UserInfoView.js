import {uniqueId} from '../../../../core/utils/index';
import $ from 'jquery';
import './UserInfoView.less';

function getInputValue(id){
    var result = {};
    $("#"+id).find('input[type=text]').each(function(){
        var $input = $(this);
        var name = $input.attr('name');
        var val = $input.val();
        result[name] = val;
    });
    return result;
}


function setAvatarUrl(id,url){
    var m = $("#"+id);
    m.find('.avatar').attr('src',url);
    m.find('.avatar-input').val(url);
}
export function toUserInfoEditingView(userInfo,onFileChangeName){

    var id = uniqueId('UserInfoViewUniqueId');
    var html = `
<div class="HeaderUserInfoView">
    <table id="${id}">
        <tr>
            <th>头像</th>
            <td>
            <div class="avatar-wrapper">
                <img class="avatar" src="${userInfo.avatar}" alt="">
                <span class="modify-avatar">上传头像</span>
                <span class="random-avatar">随机头像</span>
                <input type="file" class="modify-avatar-file" onchange="${onFileChangeName}(this)">
                <input name='avatar' type="text" class="avatar-input" value="${userInfo.avatar}" style="display: none;">
            </div>
            </td>
        </tr>
        <tr>
            <th>昵称</th>
            <td>
                <input name="nickname" type="text" value="${userInfo.nickname}">
            </td>
        </tr>
        <tr>
            <th>账号</th>
            <td>
                ${userInfo.username}
            </td>
        </tr>
       <tr>
            <th>邮箱</th>
            <td>
                <input name="mail" type="text" value="${userInfo.mail}">
            </td>
        </tr>
    </table>
</div>`;

    return {
        html:html,
        id:id,
        getInputValue:function(){
            return getInputValue(id);
        },
        setAvatarUrl:function(url){
            return setAvatarUrl(id,url);
        }
    };
}