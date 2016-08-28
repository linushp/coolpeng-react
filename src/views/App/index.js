import React, {PropTypes} from 'react';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import Header from '../../components/fragment/Header'
import './index.less';
import '../Common/common.less';
import Dialog from '../../components/dialog/Dialog';

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
        Dialog.showAlertPrompt("确定要退出吗？",function () {
            actions.logout(function () {
                debugger;
                that.context.router.push("/login");
            });
        });
    }


    render() {
        const {user, actions} = this.props;
        return (
            <div className="page-wrapper">
                <div className="page-header">
                    <Header user={user} onClickLogout={this.onClickLogout.bind(this)} />
                </div>
                <div>
                    {this.props.children}
                </div>
                <div>
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
    logout:'user.logout'
};

export default ActionStoreHelper()(App);
