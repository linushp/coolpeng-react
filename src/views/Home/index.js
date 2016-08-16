import React from 'react'
import PanelBox from '../../components/PanelBox';
import AvatarReact from '../../service/avatar/AvatarReact';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';

import './index.less'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
    }

    render() {
        var actions = this.props.actions;
        var user = this.props.user || {};
        return (
            <div>
                <AvatarReact user={user} setCurrentTempUser={actions.setCurrentTempUser}></AvatarReact>
            </div>
        );
    }
}


Home.STATE_CONFIG = {
    user: 'user'
};

Home.ACTION_CONFIG = {
    setCurrentTempUser: 'user.setCurrentTempUser'
};


export default ActionStoreHelper()(Home);