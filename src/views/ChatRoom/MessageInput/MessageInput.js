import React from 'react'
import $ from 'jquery'
import PureRenderComponent from '../../../core/PureRenderComponent';
import SimditorReact from '../../../service/editor/SimditorReact';
import {
    immutableListMap,createUUID
} from '../../../core/utils/index';
import "./MessageInput.less";

export default class MessageInput extends PureRenderComponent {
    constructor(props) {
        super(props);
    }


    makeContentImageThumb(content) {
        var userInfo = this.props.userInfo;
        var $content = $('<div>' + content + '</div>');
        $content.find('img').each(function () {
            var $img = $(this);
            var isEmoji = $img.data('emoji');
            if (("" + isEmoji) === 'true') {
                //do nothing
            } else {
                var src = $img.attr('src');
                var osrc = src;
                var width = $img.attr('width') || 0;
                var height = $img.attr('height') || 0;
                var oid = createUUID(userInfo.id);
                src = src + '@s_0,w_300,q_90,f_png';

                $img.removeAttr('width');
                $img.removeAttr('height');
                $img.attr('src', src);
                $img.attr('osrc', osrc);
                $img.attr('oid', oid);
                $img.attr('osrcwidth', width);
                $img.attr('osrcheight', height);
                $img.addClass('chat-uploaded-image');
            }
        });


        $content.find('a').each(function () {
            var $link = $(this);
            $link.attr('target', '_blank');
        });

        return $content.html();
    }


    onSendMessage() {
        var that = this;
        var editor = that.refs["SimditorReact"];
        var content = editor.getContentValue();
        content = content.trim();
        if (content.length === 0) {
            return;
        }

        var {summary} = editor.getContentParseResult(content);
        var content2 = that.makeContentImageThumb(content);
        var {onSendMessage} = that.props;//isImmutable
        onSendMessage(content2, summary, function () {
            editor.clearContentValue();
        });
    }


    triggerHandler(e) {
        var that = this;
        if (e && !e.shiftKey && e.keyCode === 13) {
            if (e.type === 'keydown') {
                return false;
            }
            if (e.type === 'keyup') {
                setTimeout(function () {
                    that.onSendMessage();
                }, 10);
                return false;
            }
        }
        return true;
    }

    render() {
        var that = this;
        var triggerHandler = that.triggerHandler.bind(that);
        var editorOptions = {
            cleanPaste: true,
            toolbar: ['emoji', 'image'],
            triggerHandler: triggerHandler
        };
        return (
            <div className="chat-message-input">
                <SimditorReact options={editorOptions} ref="SimditorReact" content={''}></SimditorReact>
                <button className="sendButton" onClick={that.onSendMessage.bind(that)}>发送</button>
            </div>
        );
    }
}