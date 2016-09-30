import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import './LeftPanelPlaceHolder.less';
import NewSessionPanel from './NewSessionPanel/NewSessionPanel';

export default class LeftPanelPlaceHolder extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentPanel:null,
            show:false
        };
    }

    onSwitchPanel(panelName){
        var that = this;
        var currentPanel = null;
        if(panelName==='newSession'){
            currentPanel = <NewSessionPanel onClose={that.onClosePanel.bind(that)}></NewSessionPanel>
        }
        that.setState({currentPanel:currentPanel});
        that.transformShow();
    }


    onClosePanel(){
        var that = this;
        that.transformHide();
        setTimeout(function(){
            that.setState({currentPanel:null});
        },5000);
    }


    transformShow(){
        this.setState({show:true});
    }


    transformHide(){
        this.setState({show:false});
    }


    render(){

        var that = this;
        var state = that.state;
        var currentPanel = state.currentPanel;
        var show = state.show;
        return (
            <div style={{'display':show?'block':'none'}} className="chat-leftPanelContainer">
                <div >
                    {currentPanel}
                </div>
            </div>
        );
    }

}