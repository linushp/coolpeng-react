import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
const hideStyle = RebixUtils.hideStyle;
const showStyle = RebixUtils.showStyle;
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

function renderSelectedItems(that, userList, rejectFilter, selectedUidMap) {
    var selectedItemsCount = 0;
    var selectedItems = userList.map(function (u) {
        if (rejectFilter(u, {selectedUidMap: selectedUidMap})) {
            return;
        }
        selectedItemsCount++;
        var uid = u.id;
        return <SelectedUserItem key={uid} userInfo={u} onRemove={that.onRemoveSelectedItem}/>
    });

    return {
        selectedItems: selectedItems,
        selectedItemsCount: selectedItemsCount
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
    };

    toggleSearchFocus = (isSearchFocus)=> {
        this.setState({isSearchFocus: isSearchFocus});
    };

    render() {

        var that = this;
        var {isSearchFocus} = that.state;
        var {userList,selectedUidMap,isMultiSelect,rejectFilter,placeholder,searchText,setSearchText} = this.props;

        var {selectedItemsCount,selectedItems} = renderSelectedItems(that, userList, rejectFilter, selectedUidMap);
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
                        <SearchBox2 searchText={searchText} setSearchText={setSearchText} toggleSearchFocus={that.toggleSearchFocus}/> :
                        <div className="recent-search">
                            <SearchBox placeholder={placeholder} onFocus={that.onSearcherFocus}/>
                        </div>
                }

            </div>
        )
    }
}
