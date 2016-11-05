import './EmojiPanelRender.less';
import $ from 'jquery';
import _ from "underscore";
import {toStringNumberArray} from '../../../core/utils/index';
function getStaticImages(p) {
  return "http://image.coolpeng.cn/static/images/"+p;
}

//http://image.coolpeng.cn/static/images/emoji/scream.png
var imageList = [
    {
        title:"默认",
        isCurrent:true,
        groupName:"moren",
        imgList:("smile:smiley:laughing:blush:heart_eyes:smirk:flushed:grin:wink:kissing_closed_eyes:stuck_out_tongue_winking_eye:stuck_out_tongue:sleeping:worried:expressionless:sweat_smile:cold_sweat:joy:sob:angry:mask:scream:sunglasses:heart:broken_heart:star:anger:exclamation:question:zzz:thumbsup:thumbsdown:ok_hand:punch:v:clap:muscle:pray:skull:trollface:100:dog2:hospital:hotel:kissing_heart:airplane:" +
        "earth_africa:eggplant:elephant:ghost:gift_heart:house_with_garden:rocket:rabbit2:shit:snake:snail:wc:x:whale").split(":"),
        path1:getStaticImages("emoji/"),
        path2:".png",
        imgClass:'ubibi-emoji'
    },
    {
        title:"企鹅",
        groupName:"qq",
        imgList:toStringNumberArray(1,129,3).concat(["036","007","105"]), //001:002:...:127:128:129
        path1:getStaticImages("biaoqing/qq/qq-"),
        path2:".gif",
        imgClass:'ubibi-emoji-qq'
    },
    {
        title:"龙猫",
        groupName:"longmao",
        imgList:toStringNumberArray(0,12,2),//"00:01:02:03:04:05:07:08:09:10:11:12",
        path1:getStaticImages("biaoqing/longmao/"),
        path2:".gif",
        imgClass:'ubibi-emoji-longmao'
    }
];


function renderTabList() {
    var tabList = _.map(imageList,function (tab) {
        var isCurrent = !!tab.isCurrent;
        var groupName = tab.groupName;
        return '<div class="tabItem tabItem_'+groupName+' isCurrent_'+isCurrent+'" groupname="'+groupName+'">'+tab.title+'</div>';
    });
    return tabList.join("");
}


function renderTabContentItem(tab) {
    var tabImgList = tab.imgList;
    var imgDomList = _.map(tabImgList,function (img) {
        var path = tab.path1 + img + tab.path2;
        var imgClass = tab.imgClass || "";
        return '<li><img class="'+imgClass+'" src="'+path+'" ></li>';
    });
    return "<ul>"+imgDomList.join("")+"</ul>";
}


function renderTabContentList() {
    var tabContentList = _.map(imageList,function (tab) {
        var groupName = tab.groupName;
        var isCurrent = !!tab.isCurrent;
        return '<div class="tabContentItem tabContentItem_'+groupName+'  isCurrent_'+isCurrent+'">'+renderTabContentItem(tab)+'<div class="clear"></div></div>'
    });
    return tabContentList.join("");
}


function bindTabSwitchEvent($html) {

    $html.on("mousedown",".tabList",function (e) {
        return false;
    });

    $html.on("click",".tabItem",function (e) {
        var $this = $(this);
        var groupname = $this.attr("groupname");
        $html.find(".tabItem").removeClass("isCurrent_true");
        $html.find(".tabContentItem").removeClass("isCurrent_true");
        $html.find(".tabItem_"+groupname).addClass("isCurrent_true");
        $html.find(".tabContentItem_"+groupname).addClass("isCurrent_true");
    });
}

export function emojiPanelRender(itemRender) {

    var html = '' +
        '<div class="UbibiEmojiPanel ubibiHandleHide">' +
        '   <div class="tabList">' + renderTabList() +'</div>' +
        '   <div class="tabContentList" >' + renderTabContentList() +'</div>' +
        '</div>';

    var $html =  $(html);
    bindTabSwitchEvent($html);
    return $html;
}