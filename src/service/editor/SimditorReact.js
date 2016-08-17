import $ from 'jquery';
import {loadStaticJS,loadStaticCSS} from '../../core/utils/index';
import './index.less';
/**
 * 支持一个入口页面,功能实现是异步加载的
 * 异步加载js文件
 */
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
            loadStaticJS('/static/lib/combo/simditor-all.min.js', function () {
                this.isInited = true;
                var Simditor = window.Simditor;
                console.log('Simditor:::', Simditor);
                toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
                var simditorRoot = this.refs.simditorRoot.getDOMNode();//拿到了原生DOM
                var $textarea = $(simditorRoot).find('textarea');
                this.editor = new Simditor({
                    textarea: $textarea,
                    upload: true,
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
