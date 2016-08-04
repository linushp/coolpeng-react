import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import NavPath from '../../components/NavPath'
import Header from '../../components/fragment/Header'
import Sidebar from '../../components/fragment/Sidebar'
import Footer from '../../components/fragment/Footer'
import LoginDialog from '../Dialogs/LoginDialog';
import {fetchProfile, logout} from '../../actions/user';

import './index.less';
import '../Common/common.less';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {user, actions} = this.props;
        //actions.fetchProfile();
    }


    onClickLogin(){
        var loginDialog = this.refs["loginDialog"];
        loginDialog.open();
    }


    render() {
        const {user, actions} = this.props;

        return (
            <div className="page-wrapper">
                <div className="page-header">
                    <Header user={user} onClickLogin={this.onClickLogin.bind(this)}  />
                </div>
                <div className="page-content">
                    <NavPath />
                    <div className="clear"></div>
                </div>
                <div className="page-content">
                    {this.props.children}
                </div>
                <div className="page-footer">
                    <Footer />
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

const mapStateToProps = (state) => {
    const {user} = state;
    return {
        user: user ? user : null
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({fetchProfile, logout}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
