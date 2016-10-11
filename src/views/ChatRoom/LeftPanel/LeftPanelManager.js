import React from 'react'
import {EventBus} from '../../../core/utils/index';
import NewSessionPanel from './NewSessionPanel/NewSessionPanel';

const EVENT_CHAT_LEFT_PANEL_PUSH = 'EVENT_CHAT_LEFT_PANEL_PUSH';
const EVENT_CHAT_LEFT_PANEL_POP = 'EVENT_CHAT_LEFT_PANEL_POP';

function pushPanelInstance(panelInstance) {
    EventBus.emit(EVENT_CHAT_LEFT_PANEL_PUSH, panelInstance);
}


export const PANEL_KEY = {
    /**
     * 创建单聊会话
     */
    NewSessionPanel: 1
};


export default class LeftPanelManager {



    /**
     * 在左侧面板中显示一个Panel
     * @param panelKey
     * @param args
     */
    static pushPanel(panelKey, args) {
        args = args || {};
        if (panelKey === PANEL_KEY.NewSessionPanel) {
            pushPanelInstance(<NewSessionPanel {...args} />);
        }
        else {
            console.error('error panel key ! ', panelKey, args);
        }
    }





    /**
     * 在左侧面板中隐藏当前显示的Panel
     */
    static popPanel() {
        EventBus.emit(EVENT_CHAT_LEFT_PANEL_POP, null);
    }



}