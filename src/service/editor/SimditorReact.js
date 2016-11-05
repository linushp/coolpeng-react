import $ from 'jquery';
import _ from 'underscore';
import {loadStaticJS,loadStaticCSS,createUUID,StringUtils,uniqueId,isFunction,EventBus} from '../../core/utils/index';
import StaticConfig from '../../core/utils/StaticConfig';
import {onXhrUpload} from '../upload/UploadUtils';
import makeExtendButton from './makeExtendButton';
import './index.less';


var EVENT_SimditorReactUbibiCodeButton = "SimditorReactUbibiCodeButton";

makeExtendButton('ubibiCode', 'code', '插入代码', function(name){
    EventBus.emit(EVENT_SimditorReactUbibiCodeButton,name);
});


var URL_HOST_ORIGIN = StaticConfig.URL_HOST_ORIGIN;

var supporyImageHostName = [
    'http://coolpeng.bj.bcebos.com',
    'http://ubibi.coolpeng.cn',
    'http://image.coolpeng.cn'
];

function isImageUploadSupport(url) {
    for (var i = 0; i < supporyImageHostName.length; i++) {
        var hostName = supporyImageHostName[i];
        if (StringUtils.startsWith(url, hostName)) {
            return true;
        }
    }
    return false;
}


// loadStaticCSS(StaticConfig.SIMDITOR_CSS, function () {
//     loadStaticJS(StaticConfig.SIMDITOR_JS, function (isNewLoad) {
/**
 * 可以直接使用
 * <SimditorReact ref="SimditorReact" content={content}></SimditorReact>
 * content 的内容变化后,会自动重新渲染.
 */
export default class SimditorReact extends React.Component {
    constructor(props) {
        super(props);
        this.isInited = false;
        this.editor = null;
        this.contentValue = null;
        this.callbackList = [];
        this.uniqueId = uniqueId("SimditorReactUniqueId");

    }

    componentWillMount() {

    }

    componentDidMount() {
        var that = this;
        var content = that.props.content;
        that.setContentValue(content);
        that._onUbibiExtendBtn = that.onUbibiExtendBtn.bind(that);
        EventBus.addEventListener(EVENT_SimditorReactUbibiCodeButton,that._onUbibiExtendBtn)
    }

    onUbibiExtendBtn(name){
        var onUbibiExtendBtn = this.props.onUbibiExtendBtn;
        if(onUbibiExtendBtn){
            onUbibiExtendBtn(name);
        }
    }

    initSimditorView(callback) {

        if (callback) {
            this.callbackList.push(callback);
        }

        if (this.editor) {
            this.runInitedCallback();
            return;
        }

        var that = this;
        var options = this.props.options || {};
        var triggerHandler = options.triggerHandler;
        var emojiPanelRender = options.emojiPanelRender;
        var isNewLoad = false;

        var Simditor = window.Simditor;
        var toolbar = ["emoji", 'title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
        var simditorRoot = this.refs.simditorRoot.getDOMNode();//拿到了原生DOM
        var $textarea = $(simditorRoot).find('textarea');
        var editorOptions = {
            textarea: $textarea,
            upload: {
                onXhrUpload: function (file, _this, onSuccess, onError, onProgress) {
                    onXhrUpload(file, onSuccess, onError, onProgress);
                }
            },
            emoji: {
                imagePath: 'http://image.coolpeng.cn/static/images/emoji/',
                emojiPanelRender:emojiPanelRender
            },
            pasteImage: true,
            defaultImage: 'http://image.coolpeng.cn/static/images/editor-default-img.png',
            toolbar: toolbar,
            toolbarFloat: false,
            triggerHandler: function (a, b, c, d, e) {
                if (isFunction(triggerHandler)) {
                    return triggerHandler(a, b, c, d, e);
                }
                return true;
            }
        };

        var mergerOptions = _.extend({},editorOptions, options);
        that.editor = new Simditor(mergerOptions);
        if (isNewLoad) {
            setTimeout(function () {
                that.runInitedCallback();
            }, 1000);
        } else {
            that.runInitedCallback();
        }

    }

    runInitedCallback() {
        var that = this;
        var callbackList = that.callbackList || [];
        for (var i = 0; i < callbackList.length; i++) {
            var callback = callbackList[i];
            callback.bind(that)();
        }
        that.callbackList = [];
        window.setTimeout(function () {
            $("#" + that.uniqueId).css({"opacity": "1"});
        }, 10);
    }

    setContentValue(contentValue) {
        var that = this;
        that.initSimditorView(function () {
            if (contentValue === null || contentValue === undefined) {
                return;
            }

            if (that.contentValue === contentValue) {
                return;
            }

            that.contentValue = contentValue;
            that.editor.setValue(contentValue);

            console.log('that.editor.setValue(contentValue);22222');
        });
    }

    clearContentValue() {
        var that = this;
        that.initSimditorView(function () {
            that.editor.setValue("");
        });
    }


    getContentValue() {
        var that = this;
        if (that.editor) {
            return that.editor.getValue();
        }
        return null;
    }


    /**
     * 获取文章中所有的上传的图片,不包含外链图片
     * @param content
     */
    getContentParseResult(content) {
        content = content || this.getContentValue();
        var $content = $('<div>' + content + '</div>');
        var $imgs = $content.find('img');
        var imageList = [];
        $imgs.each(function () {
            var $img = $(this);
            var url = $img.attr('src');
            if (isImageUploadSupport(url)) {
                imageList.push(url);
            }
        });

        var contentText = $content.text() || "";
        var summary = (contentText.substring(0, 300) || "").trim();
        if(summary.length===0){
            summary = "[表情]";
            if(imageList.length>0){
                summary = "[图片]";
            }
        }

        return {
            imageList: imageList,
            contentText: contentText,
            summary: summary
        };
    }


    shouldComponentUpdate(nextProps, nextState) {
        //不允许重绘DOM
        return false;
    }

    componentWillReceiveProps(nextProps) {
        var content = nextProps.content;
        this.setContentValue(content);
    }

    componentWillUnmount() {
        if (this.editor) {
            this.editor.destroy();
        }
        this.isInited = false;
        this.editor = null;
        this.contentValue = null;
        EventBus.removeEventListener(EVENT_SimditorReactUbibiCodeButton,this._onUbibiExtendBtn)
    }

    render() {

        return (
            <div id={this.uniqueId} className="simditor-react-root" ref='simditorRoot'>
                <div className="wrapper">
                    <section>
                        <textarea className="simditor-react-textarea" placeholder="" autofocus></textarea>
                    </section>
                </div>
            </div>
        );
    }
}
