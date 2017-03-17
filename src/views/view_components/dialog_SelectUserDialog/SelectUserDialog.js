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
    var uid = userInfo.id;
    var uuid = "U" + uid;
    var isSelected = !!selectedUidMap.get(uuid);
    return !isSelected;
}

class SelectUserDialog extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedUidMap: immutable.fromJS({}),
            isLoading: false,
            searchText:''
        };
    }

    onClickItem = (e1, e2, userInfo, userList)=> {

        var {onClickItem,isMultiSelect} = this.props;
        if (onClickItem) {
            onClickItem(e1, e2, userInfo, userList);
        }

        //多选
        if (isMultiSelect) {
            var uid = userInfo.id;
            this.toggleSelectedUidMap(uid,true);
        }
    };

    setSearchText =(searchText)=>{
        this.setState({searchText:searchText});
    };

    toggleSelectedUidMap = (uid, isSelected)=> {
        var selectedUidMap = this.state.selectedUidMap;
        selectedUidMap = selectedUidMap.set('U' + uid, isSelected);
        this.setState({selectedUidMap: selectedUidMap});
    };


    onSelectFinished = ()=> {

    };

    filterUserList =(userInfo, {selectedUidMap})=>{
        var that = this;
        var {searchText} = that.state;

        var isNameMatch = true;
        if (searchText) {
            searchText = searchText.toLowerCase();
            var nickname = (userInfo.nickname || '').toLowerCase();
            isNameMatch = nickname.indexOf(searchText)>=0;
        }

        var isFilter = filterBySelectedUidMap(userInfo,{selectedUidMap}) ;
        var isOK = isFilter && isNameMatch;
        return isOK;
    };

    render() {
        var that = this;
        var {userAccountTopList,isMultiSelect} = that.props;
        var {selectedUidMap,isLoading,searchText} = that.state;
        var isShowCreateButton = isMultiSelect && (selectedUidMap.size > 0);

        return (
            <div className="SelectUserDialog">

                <SelectedAndSearch userList={userAccountTopList}
                                   selectedUidMap={selectedUidMap}
                                   searchText={searchText}
                                   setSearchText={that.setSearchText}
                                   toggleSelectedUidMap={that.toggleSelectedUidMap}
                                   isMultiSelect={isMultiSelect}
                                   rejectFilter={filterBySelectedUidMap}/>

                <UserList userList={userAccountTopList}
                          selectedUidMap={selectedUidMap}
                          searchText={searchText}
                          filter={that.filterUserList}
                          onClickItem={that.onClickItem}
                          ExtendInfoComponent={null}
                          ExtendAvatarComponent={null}/>

                <CreateGroupButton onClick={that.onSelectFinished}
                                   isShow={isShowCreateButton}
                                   isLoading={isLoading}/>

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
        ModelDialog.openDialog(SelectUserModelDialog, {
            dialogTitle: '新建会话',
            onClickItem: onClickItem,
            isMultiSelect: isMultiSelect
        });
    }
};