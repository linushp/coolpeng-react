import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import RenderToBody from '../RenderToBody';
import {listMap,className,EventBus,uniqueId,isEventInTarget} from '../../core/utils/index';
import './index.less';

var EVENT_DOCUMENT_CLICK = 'EVENT_DOCUMENT_CLICK';

// 将子组件渲染到 document.body 上
export default class PopupOperation extends React.Component {
    static propTypes = {
        children: React.PropTypes.node.isRequired // 只允许传单个子组件
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            positionX:0,
            positionY:0
        };
        this.uniqueId = uniqueId('PopupOperationUniqueId');
        this.documentClickListener = this.documentClickListener0.bind(this);
    }


    componentDidUpdate() {

    }

    componentDidMount() {
        EventBus.addEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener)
    }

    componentWillUnmount() {
        EventBus.removeEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener);
    }

    onClickBtn(e) {

        //var $target = $(e.target);
        //var w = $target.width();
        //var h = $target.height();

        var x = e.pageX;
        var y = e.pageY;
        this.setState({
            show: true,
            positionX:x,
            positionY:y
        });
    }

    documentClickListener0(evt, self) {
        if (!isEventInTarget(evt, this.uniqueId)) {
            this.setState({
                show: false
            });
        }
    }


    render() {
        var btns = this.props.btns || [];
        var cntClassName = className({
            'cp-popup-ctn': true,
            'cp-popup-ctn-show': this.state.show
        });

        var cntStyle ={
            position:'absolute',
            top:this.state.positionY,
            left:this.state.positionX
        };

        return (
            <div className="cp-popup-b" id={this.uniqueId}>
                <div className="cp-popup-btn" onClick={this.onClickBtn.bind(this)}>{this.props.children}</div>
                <RenderToBody>
                    <div className={cntClassName} style={cntStyle}>
                        <ul className="cp-popup-ul-1">
                            {listMap(btns, function (btn) {
                                if (btn.isDisplay === false) {
                                    return null;
                                }
                                return (
                                    <li className="cp-popup-li-1" onClick={btn.onClick}>{btn['text']}</li>
                                );
                            })}
                        </ul>
                    </div>
                </RenderToBody>
            </div>);
    }

}


//function test() {
//    var data = [
//        {
//            data: '',
//            text: '删除',
//            onClick: function () {
//            }
//        }
//    ];
//}