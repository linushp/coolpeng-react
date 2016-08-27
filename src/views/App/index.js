import React, {PropTypes} from 'react';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import Header from '../../components/fragment/Header'
import LoginDialog from '../Dialogs/LoginDialog';
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
                <div>
                    {this.props.children}
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
