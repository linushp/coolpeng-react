import $ from 'jquery';

//import a from '../../../static/lib/combo/simditor-all';

import {loadStaticJS,loadStaticCSS} from '../../core/utils/index';

/**
 * 支持一个入口页面,功能实现是异步加载的
 * 异步加载js文件
 */
export default class SimditorReact extends React.Component {
    constructor(props) {
        super(props);
        this.isInited = false;
    }

    componentWillMount() {

    }


    componentDidMount() {
        this.initSimditorView();
    }

    initSimditorView() {

        if (this.isInited === true) {
            return;
        }

        var that = this;

        loadStaticCSS('/static/lib/combo/simditor.css',function(){
            loadStaticJS('/static/lib/combo/simditor-all.js',function(){
                this.isInited = true;
                var Simditor = window.Simditor;
                console.log('Simditor:::',Simditor);

                var simditorRoot = this.refs.simditorRoot.getDOMNode();//拿到了原生DOM
                var $textarea = $(simditorRoot).find('textarea');
                var editor = new Simditor({
                    textarea: $textarea,
                    upload:true,
                    pasteImage:true,
                    defaultImage:'http://image.coolpeng.cn/static/images/editor-default-img.png'
                });
            }.bind(that));
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="simditor-react-root" ref='simditorRoot'>
                <textarea className="simditor-react-textarea" placeholder="这里输入内容" autofocus></textarea>
            </div>
        );
    }
}
