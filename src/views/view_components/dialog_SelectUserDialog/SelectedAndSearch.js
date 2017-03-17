import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
const hideStyle = RebixUtils.hideStyle;
const showStyle = RebixUtils.showStyle;
const forEach = RebixUtils.forEach;
const map = RebixUtils.map;
import './SelectedAndSearch.less';

import SearchBox from '../../../components/SearchBox/SearchBox';
import SearchBox2 from '../../../components/SearchBox/SearchBox2';
import UserAvatar from '../../../components/UserAvatar/UserAvatar';


const SelectedUserItem = createPureComponent(function (props) {
    var {onRemove,userInfo} = props;
    return (
        <div className="VC_SelectedUserItem">
            <UserAvatar avatar={userInfo.avatar} size={26}/>
            <span className="nickname">{userInfo.nickname}</span>
            <div className="remove" onClick={()=>{onRemove(userInfo)}}>
                <div className="removeIcon"></div>
            </div>
        </div>
    );
});


function toUserInfoMap(userList){
    var map = {};

    forEach(userList,function(userInfo){
        var uid = userInfo.id;
        map['U' + uid] = userInfo;
    });

    return map;
}

function renderSelectedItems(that, userList, selectedUidList) {

    var userInfoMap = toUserInfoMap(userList);
    var selectedItems = map(selectedUidList,function(uid){
        var userInfo = userInfoMap['U'+uid];
        return <SelectedUserItem key={uid} userInfo={userInfo} onRemove={that.onRemoveSelectedItem}/>
    });

    return {
        selectedItems: selectedItems,
        selectedItemsCount: selectedUidList.size
    };
}


export default class SelectedAndSearch extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSearchFocus: false
        };
    }

    onRemoveSelectedItem = (userInfo)=> {
        var uid = userInfo.id;
        var toggleSelectedUidMap = this.props.toggleSelectedUidMap;
        toggleSelectedUidMap(uid, false);
    };

    onSearcherFocus = ()=> {
        this.setState({isSearchFocus: true});
        setTimeout(()=>{
            var SearchBox2 = this.refs['SearchBox2'];
            SearchBox2.makeInputFocus();
        },20);
    };

    toggleSearchFocus = (isSearchFocus)=> {
        this.setState({isSearchFocus: isSearchFocus});
    };

    //删除掉最后一个选中的
    handleDeleteLastSelected = ()=> {
        var {selectedUidList,toggleSelectedUidMap} = this.props;
        var lastUid = selectedUidList.last();
        toggleSelectedUidMap(lastUid,false);
    };

    render() {

        var that = this;
        var {isSearchFocus} = that.state;
        var {userList,selectedUidMap,selectedUidList,isMultiSelect,rejectFilter,placeholder,searchText,setSearchText} = this.props;

        var {selectedItemsCount,selectedItems} = renderSelectedItems(that, userList, selectedUidList);
        var isSelectedEmpty = selectedItemsCount === 0;
        var isShowGSearchBox = (isSearchFocus || !isSelectedEmpty || searchText);

        //多选
        return (
            <div className="VC_SelectedAndSearch" ref="SelectedAndSearch">
                <div className="VC_selectItemList" style={hideStyle(isSelectedEmpty)}>
                    {selectedItems}
                    <div className="clear"></div>
                </div>

                {
                    (isShowGSearchBox) ?
                        <SearchBox2 ref="SearchBox2"
                                    searchText={searchText}
                                    setSearchText={setSearchText}
                                    onDeleteEmpty={that.handleDeleteLastSelected}
                                    toggleSearchFocus={that.toggleSearchFocus} /> :
                        <div className="recent-search">
                            <SearchBox placeholder={placeholder} onFocus={that.onSearcherFocus}/>
                        </div>
                }

            </div>
        )
    }
}
