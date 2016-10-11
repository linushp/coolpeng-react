import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import LeftPanelManager from './LeftPanelManager';
import {showStyle} from '../../../core/utils/JSXRenderUtils';
import {EventBus} from '../../../core/utils/index';
import Icon from '../../../components/icons/Icon';
import './LeftPanelHeader.less';

export default class LeftPanelHeader extends PureRenderComponent {


    constructor(props) {
        super(props);
    }


    onGoBack(){
        LeftPanelManager.popPanel();
    }

    render() {
        var that = this;
        var {title} = that.props;
        return (
            <div className="chat-LeftPanelHeader">
                <div className="title" >
                    <div className="action" onClick={that.onGoBack.bind(that)}>
                        <Icon icon="arrow-left2"></Icon>
                    </div>
                    <div className="text">{title}</div>
                </div>
            </div>
        );
    }

}