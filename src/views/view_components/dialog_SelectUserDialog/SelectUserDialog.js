import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import immutable from 'immutable';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import UserAccountStore from '../../../stores/UserAccountStore';
import UserList from '../UserList/UserList';
import ModelDialog from '../../../components/Dialog/ModelDialog';
import SelectedAndSearch from './SelectedAndSearch';
import CreateGroupButton from '../CreateGroupButton/CreateGroupButton';
import './SelectUserDialog.less';


function filterBySelectedUidMap(userInfo, {selectedUidMap}) {
    return true;
}

class SelectUserDialog extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedUidMap: immutable.fromJS({}),
            isLoading:false
        };
    }

    onClickItem = (e1, e2, userInfo, userList)=> {
        var {onClickItem} = this.props;
        if (onClickItem) {
            onClickItem(e1, e2, userInfo, userList);
        }
        var selectedUidMap = this.state.selectedUidMap;
        selectedUidMap = selectedUidMap.set('U' + userInfo.id, true);
        this.setState({selectedUidMap: selectedUidMap});
    };


    onSelectFinished=()=>{

    };

    render() {
        var that = this;
        var {userAccountTopList,isMultiSelect} = this.props;
        var {selectedUidMap,isLoading} = this.state;
        var isShowCreateButton = isMultiSelect && (selectedUidMap.size > 0);

        return (
            <div className="SelectUserDialog">
                <SelectedAndSearch userList={userAccountTopList} selectedUidMap={selectedUidMap} isMultiSelect={isMultiSelect}/>
                <UserList userList={userAccountTopList}
                          selectedUidMap={selectedUidMap}
                          filter={filterBySelectedUidMap}
                          onClickItem={that.onClickItem}
                          ExtendInfoComponent={null}
                          ExtendAvatarComponent={null} />
                <CreateGroupButton onClick={that.onSelectFinished} isShow={isShowCreateButton} isLoading={isLoading}/>
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


class SelectUserModelDialog extends ModelDialog {

    getDialogTitle() {
        var {dialogTitle} = this.props || {};
        return dialogTitle;
    }

    onClickItem = (e1, e2, userInfo, userList)=> {
        var {onClickItem} = this.props;
        var that = this;
        onClickItem(e1, e2, userInfo, userList, function () {
            that.close();
        });
    };

    renderContent() {
        var {isMultiSelect} = this.props;
        return <SelectUserDialogConnected onClickItem={this.onClickItem} isMultiSelect={isMultiSelect}/>
    }
}

export default {
    openDialog: function ({onClickItem,isMultiSelect}) {
        ModelDialog.openDialog(SelectUserModelDialog, {dialogTitle: '新建会话', onClickItem: onClickItem,isMultiSelect:isMultiSelect});
    }
};