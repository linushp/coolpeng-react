import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import LeftPanelWrapper from './LeftPanelWrapper';
import {showStyle} from '../../../core/utils/JSXRenderUtils';
import {EventBus} from '../../../core/utils/index';
import './LeftPanelPlaceHolder.less';

const EVENT_CHAT_LEFT_PANEL_PUSH = 'EVENT_CHAT_LEFT_PANEL_PUSH';
const EVENT_CHAT_LEFT_PANEL_POP = 'EVENT_CHAT_LEFT_PANEL_POP';

function createPanelWrapper(panel, isPanelActive) {
    return {
        panel: panel,
        isPanelActive: isPanelActive
    }
}

const ANIMATOR_DURATION = 200;

export default class LeftPanelPlaceHolder extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            panelStack: []
        };
    }

    componentDidMount() {
        this._onPushPanel = this.onPushPanel.bind(this);
        this._onPopPanel = this.onPopPanel.bind(this);
        EventBus.addEventListener(EVENT_CHAT_LEFT_PANEL_PUSH, this._onPushPanel);
        EventBus.addEventListener(EVENT_CHAT_LEFT_PANEL_POP, this._onPopPanel);
    }

    componentWillUnmount() {
        EventBus.removeEventListener(EVENT_CHAT_LEFT_PANEL_PUSH, this._onPushPanel);
        EventBus.removeEventListener(EVENT_CHAT_LEFT_PANEL_POP, this._onPopPanel);
    }

    onPushPanel(nextPanel) {
        var that = this;
        var panelStack = [].concat(that.state.panelStack);
        panelStack.push(createPanelWrapper(nextPanel, true));
        that.setState({panelStack: panelStack});
    }

    onPopPanel() {
        var that = this;
        var panelStack = [].concat(that.state.panelStack);
        var topPanel = panelStack[panelStack.length - 1];
        topPanel.isPanelActive = false; //先执行隐藏动画
        that.setState({panelStack: panelStack});
        window.setTimeout(function () {
            panelStack = [].concat(that.state.panelStack);
            panelStack.pop();
            that.setState({panelStack: panelStack});
        }, ANIMATOR_DURATION);
    }


    render() {

        var that = this;
        var state = that.state;
        var panelStack = state.panelStack || [];
        var show = panelStack.length > 0;
        return (
            <div className="chat-LeftPanelPlaceHolder" style={showStyle(show)}>
                <div className="PanelList">
                    {
                        panelStack.map(function (panelWrapper, i) {
                            var style = {
                                "zIndex": (10 + i)
                            };
                            var {isPanelActive,panel} = panelWrapper;
                            return (
                                <LeftPanelWrapper className="PanelWrapper"
                                                  activeClassName='active'
                                                  nextActive={isPanelActive}
                                                  style={style}
                                                  key={i}>
                                    {panel}
                                </LeftPanelWrapper>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

}