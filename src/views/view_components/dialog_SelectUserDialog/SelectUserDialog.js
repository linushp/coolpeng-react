import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import UserAccountStore from '../../../stores/UserAccountStore';
import UserList from '../UserList/UserList';
import ModelDialog from '../../../components/Dialog/ModelDialog';

class SelectUserDialog extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var {userAccountTopList} = this.props;
        return (
            <div className="SelectUserDialog">
                <UserList userList={userAccountTopList}/>
            </div>
        );
    }
}

var SelectUserDialogConnected = RebixFlux.connect(SelectUserDialog, UserAccountStore, function (store, props, context, connectState, that) {
    var userAccountTopList = getDeepValue(store, 'userAccountTopList');
    return {
        userAccountTopList: userAccountTopList
    };
});


class SelectUserModelDialog extends ModelDialog{

    getDialogTitle() {
        var {dialogTitle} = this.props || {};
        return dialogTitle;
    }

    renderContent() {
        return <SelectUserDialogConnected />
    }
}

export default {
    openDialog: function () {
        ModelDialog.openDialog(SelectUserModelDialog,{dialogTitle:'新建会话'});
    }
};