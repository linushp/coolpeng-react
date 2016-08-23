import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
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
            show: false
        };
        this.uniqueId = uniqueId('PopupOperationUniqueId');
        this.documentClickListener = this.documentClickListener0.bind(this);
    }


    componentDidMount() {
        EventBus.addEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener)
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        EventBus.removeEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener);
    }


    onClickBtn() {
        this.setState({
            show: true
        });
    }

    documentClickListener0(evt, self) {
        if(this.state.show){
            if (!isEventInTarget(evt, this.uniqueId)) {
                this.setState({
                    show: false
                });
            }
        }
    }


    render() {
        var btns = this.props.btns || [];
        var cntClassName = className({
            'cp-popup-ctn': true,
            'cp-popup-ctn-show': this.state.show
        });

        return (
            <div className="cp-popup-b" id={this.uniqueId}>
                <div className="cp-popup-btn" onClick={this.onClickBtn.bind(this)}>{this.props.children}</div>
                <div className={cntClassName}>
                    <ul>
                        {listMap(btns, function (btn) {
                            if (btn.isDisplay === false) {
                                return null;
                            }
                            return (
                                <li onClick={btn.onClick}>{btn['text']}</li>
                            );
                        })}
                    </ul>
                </div>
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