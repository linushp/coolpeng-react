import React from 'react'
import PanelBox from '../../components/PanelBox';
import AvatarReact from '../../service/avatar/AvatarReact';
import SimditorReact from '../../service/editor/SimditorReact';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';

import './index.less'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content:""
        };
    }

    componentWillMount() {
    }

//    onClickSetRandomButton(){
//        var x = Math.random();
//        this.setState({
//            content:x
//        });
//    }
//
//    onClickGetValueButton(){
//        var editor = this.refs['SimditorReact'];
//        var x = editor.getContentValue();
//        alert(x);
//    }
//<button onClick={this.onClickSetRandomButton.bind(this)}> setRandom </button>
//<button onClick={this.onClickGetValueButton.bind(this)}> getValue </button>
//
    render() {
        var actions = this.props.actions;
        var user = this.props.user || {};
        return (
            <div>

                <SimditorReact ref="SimditorReact" content={this.state.content}></SimditorReact>
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