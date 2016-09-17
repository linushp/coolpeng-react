import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import template from './index.rt';
import './index.less'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
            nameList:["aaa","bbbb","ccc"]
        };
    }
    

    render() {
        var actions = this.props.actions;
        var user = this.props.user || {};
        return template.apply(this,this.state);
    }
}


Home.STATE_CONFIG = {
    user: 'user'
};

Home.ACTION_CONFIG = {
    setCurrentTempUser: 'user.setCurrentTempUser'
};

export default ActionStoreHelper()(Home);