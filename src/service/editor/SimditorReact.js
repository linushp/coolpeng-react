import $ from 'jquery';
import {loadStaticJS,loadStaticCSS,createUUID} from '../../core/utils/index';
import './index.less';
/**
 * 支持一个入口页面,功能实现是异步加载的
 * 异步加载js文件
 */


function getSuffix (url) {
    if(!url){
        return "";
    }
    try {
        var index = url.lastIndexOf('.');
        if (index <= 0) return '';
        return url.substr(index);
    }catch (e){
        return '';
    }
}

function onXhrUpload(file,_this,onSuccess,onError,onProgress) {

    loadStaticJS('/static/lib/bce-bos-uploader.bundle.min.js', function () {

        var baidubce = window.baidubce;

        var bosConfig = {
            credentials: {
                ak: 'f0131c5559d3415e956706caf01d1051',
                sk: 'ba90fcb9ee2441faa32f49a909192cc9'
            },
            endpoint: 'http://ubibi.gz.bcebos.com' // 根据您选用bos服务的区域配置相应的endpoint
        };
        var bucket = 'upload'; // 设置您想要操作的bucket
        var client = new baidubce.sdk.BosClient(bosConfig);

        //var file = evt.target.files[0]; // 获取要上传的文件
        var key = file.name; // 保存到bos时的key，您可更改，默认以文件名作为key
        var blob = file.obj;

        var ext = key.split(/\./g).pop();
        var mimeType = baidubce.sdk.MimeType.guess(ext);
        if (/^text\//.test(mimeType)) {
            mimeType += '; charset=UTF-8';
        }
        var options = {
            'Content-Type': mimeType
        };

        //var saveName = new Date().getTime() + '' + Math.floor(Math.random() * 1000000) + key;
        var saveName = new Date().getTime() + '' + createUUID() + getSuffix(key);

        client.putObjectFromBlob(bucket, saveName, blob, options)
            .then(function (res) {
                // 上传完成，添加您的代码
                console.log('上传成功');
                var result = {
                    success: true,
                    msg: null,
                    file_path: 'http://ubibi.coolpeng.cn/upload/' + saveName
                };
                onSuccess(result);
            })
            .catch(function (err) {
                // 上传失败，添加您的代码
                console.error(err);
                onError('上传失败');
            });

        client.on('progress', function (evt) {
            // 监听上传进度
            if (evt.lengthComputable) {
                // 添加您的代码
                onProgress(evt.loaded, evt.total);
            }
        });

    })
}



export default class SimditorReact extends React.Component {
    constructor(props) {
        super(props);
        this.isInited = false;
        this.editor = null;
        this.contentValue = null;
    }

    componentWillMount() {

    }


    componentDidMount() {
        var that = this;
        that.initSimditorView(function(){
            var content = that.props.content || '';
            that.setContentValue(content);
        });
    }

    initSimditorView(callback) {

        if (this.isInited === true) {
            return;
        }

        var that = this;

        loadStaticCSS('/static/lib/combo/simditor.css', function () {
            loadStaticJS('/static/lib/combo/simditor-all.js', function () {
                this.isInited = true;
                var Simditor = window.Simditor;
                console.log('Simditor:::', Simditor);
                toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
                var simditorRoot = this.refs.simditorRoot.getDOMNode();//拿到了原生DOM
                var $textarea = $(simditorRoot).find('textarea');
                this.editor = new Simditor({
                    textarea: $textarea,
                    upload: {
                        onXhrUpload:function(file,_this,onSuccess,onError,onProgress){
                            onXhrUpload(file,_this,onSuccess,onError,onProgress);
                        }
                    },
                    pasteImage: true,
                    defaultImage: 'http://image.coolpeng.cn/static/images/editor-default-img.png',
                    toolbar: toolbar,
                    toolbarFloat: false
                });

                callback && callback();
            }.bind(that));
        });
    }

    setContentValue(contentValue){

        if (this.contentValue === contentValue) {
            return;
        }
        var that = this;
        if (that.editor) {
            that.editor.setValue(contentValue);
            console.log('that.editor.setValue(contentValue);111111');
            this.contentValue = contentValue;
        } else {
            that.initSimditorView(function () {
                that.editor.setValue(contentValue);
                this.contentValue = contentValue;
                console.log('that.editor.setValue(contentValue);22222');
            })
        }
    }


    getContentValue(){
        var that = this;
        if (that.editor) {
            return that.editor.getValue();
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //不允许重绘DOM
        return false;
    }
    componentWillReceiveProps(nextProps) {
        var content = nextProps.content || '';
        this.setContentValue(content);
    }
    componentWillUnmount(){
        if (this.editor) {
            this.editor.destroy();
        }
        this.isInited = false;
        this.editor = null;
        this.contentValue = null;
        console.log('SimditorReact componentWillUnmount')
    }

    render() {
        return (
            <div className="simditor-react-root" ref='simditorRoot'>
                <div className="wrapper">
                    <section>
                        <textarea className="simditor-react-textarea" placeholder="这里输入内容" autofocus></textarea>
                    </section>
                </div>
            </div>
        );
    }
}
