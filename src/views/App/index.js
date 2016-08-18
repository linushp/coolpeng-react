import React, {PropTypes} from 'react';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import NavPath from '../../components/fragment/NavPath'
import Header from '../../components/fragment/Header'
import Sidebar from '../../components/fragment/Sidebar'
import Footer from '../../components/fragment/Footer'
import LoginDialog from '../Dialogs/LoginDialog';


//import {fetchProfile, logout} from '../../actions/user';

import './index.less';
import '../Common/common.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const {user, actions} = this.props;
        //actions.fetchProfile();
    }


    onClickLogin(){
        var loginDialog = this.refs["loginDialog"];
        loginDialog.open();
    }

    onClickLogout(){
        const {user, actions} = this.props;
        actions.logout();
    }


    render() {
        const {user, actions} = this.props;
        return (
            <div className="page-wrapper">
                <div className="page-header">
                    <Header user={user} onClickLogin={this.onClickLogin.bind(this)}  onClickLogout={this.onClickLogout.bind(this)} />
                </div>
                <div className='page-sidebar' >
                     <Sidebar user={user} sidebar={this.props.sidebar}></Sidebar>
                </div>
                <div className="page-content page-content-main">
                    <NavPath user={user} actions={actions} />
                    <div className="clear"></div>
                    {this.props.content || this.props.children}
                </div>
                <div className="page-footer">
                    <Footer user={user}/>
                </div>
                <div>
                    <LoginDialog ref="loginDialog" ></LoginDialog>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.object,
    children: PropTypes.node.isRequired,
};

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

App.STATE_CONFIG = {
    user: 'user'
};

App.ACTION_CONFIG = {
    fetchProfile: 'user.fetchProfile',
    logout:'user.logout'
};

export default ActionStoreHelper()(App);
