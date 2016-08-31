import {uniqueId} from '../../../core/utils/index';
import $ from 'jquery';
import './UserInfoView.less';

function getInputValue(id){
    var result = {};
    $("#"+id).find('input').each(function(){
        var $input = $(this);
        var name = $input.attr('name');
        var val = $input.val();
        result[name] = val;
    });
    return result;
}


export function toUserInfoEditingView(userInfo){

    var id = uniqueId('UserInfoViewUniqueId');
    var html = `
    <div class="HeaderUserInfoView">
        <table id="${id}">
            <tr>
                <th>头像</th>
                <td>
                    <img class="avatar" src="${userInfo.avatar}" alt="">
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
    </div>
    `;
    return {
        html:html,
        id:id,
        getInputValue:function(){
            return getInputValue(id);
        }
    };
}