import $ from 'jquery';
import {loadStaticJS,loadStaticCSS,createUUID,StringUtils,uniqueId} from '../../core/utils/index';
import StaticConfig from '../../core/utils/StaticConfig';
import {onXhrUpload} from '../upload/UploadUtils';
import './index.less';

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
        var toolbar = that.props.toolbar;
        var isNewLoad = false;
        // loadStaticCSS(StaticConfig.SIMDITOR_CSS, function () {
        //     loadStaticJS(StaticConfig.SIMDITOR_JS, function (isNewLoad) {
                var Simditor = window.Simditor;

                if(!toolbar){
                    toolbar = ["emoji",'title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
                }

                var simditorRoot = this.refs.simditorRoot.getDOMNode();//拿到了原生DOM
                var $textarea = $(simditorRoot).find('textarea');
                that.editor = new Simditor({
                    textarea: $textarea,
                    upload: {
                        onXhrUpload: function (file, _this, onSuccess, onError, onProgress) {
                            onXhrUpload(file, onSuccess, onError, onProgress);
                        }
                    },
                    emoji: {
                        imagePath: URL_HOST_ORIGIN + '/static/images/emoji/'
                    },
                    pasteImage: true,
                    defaultImage: URL_HOST_ORIGIN + '/static/images/editor-default-img.png',
                    toolbar: toolbar,
                    toolbarFloat: false
                });
                if (isNewLoad) {
                    setTimeout(function () {
                        that.runInitedCallback();
                    }, 1000);
                } else {
                    that.runInitedCallback();
                }

            // }.bind(that));
        // });
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
            $("#"+that.uniqueId).css({"opacity":"1"});
        },10);
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

    clearContentValue(){
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

        return {
            imageList:imageList,
            contentText:contentText,
            summary:contentText.substring(0,300)
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
