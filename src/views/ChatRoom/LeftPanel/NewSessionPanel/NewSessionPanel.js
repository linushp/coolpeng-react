import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID} from '../../../../core/utils/index';
import PureRenderComponent from '../../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../../Common/ActionStoreHelper';

export default class NewSessionPanel extends PureRenderComponent {

    constructor(props) {
        super(props);
    }


    render(){
        return <div></div>
    }

}