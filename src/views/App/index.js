import React, {PropTypes} from 'react';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import Header from './fragment/Header'
import './index.less';
import '../Common/common.less';
import Dialog from '../../components/dialog/Dialog';
import WebSocketHelper from './websocket/WebSocketHelper';

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


    onClickLogout(){
        var that = this;
        const {user, actions} = this.props;
        Dialog.showAlertPrompt("确定要退出吗？",function (btn) {
            if(btn.name==='ok'){
                actions.logout(function () {
                    that.context.router.push("/login");
                });
            }
        });
    }


    render() {
        const {user, actions} = this.props;
        return (
            <div className="page-wrapper">
                <WebSocketHelper></WebSocketHelper>
                <div className="page-header">
                    <Header user={user} onClickLogout={this.onClickLogout.bind(this)} updateUserInfo={actions.updateUserInfo}/>
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.object,
    children: PropTypes.node.isRequired
};

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
};

App.STATE_CONFIG = {
    user: 'user'
};

App.ACTION_CONFIG = {
    fetchProfile: 'user.fetchProfile',
    logout:'user.logout',
    updateUserInfo:"user.updateUserInfo"
};

export default ActionStoreHelper()(App);
