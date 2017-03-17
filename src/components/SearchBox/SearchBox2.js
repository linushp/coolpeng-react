/**
 * Created by luanhaipeng on 17/3/17.
 */

import React from 'react'
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const PureRenderComponent = RebixFlux.PureRenderComponent;
import './SearchBox2.less';

export default class SearchBox2 extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    onSearcherChange = (e)=> {
        var setSearchText = this.props.setSearchText;
        setSearchText(e.target.value);
    };

    onBlurSearchInput = ()=> {
        var toggleSearchFocus= this.props.toggleSearchFocus;
        toggleSearchFocus(false);
    };

    onKeyDown=(e)=> {

    };

    quitGlobalSearch = ()=> {
        var setSearchText = this.props.setSearchText;
        setSearchText("");
    };

    onClearSearchText = ()=> {
        var setSearchText = this.props.setSearchText;
        setSearchText("");
    };

    render() {

        var props = this.props;
        var that = this;
        var searchText = props.searchText;
        var style = props.style || {};

        return (
            <div className="comp-SearchBox2" style={style}>
                <div className="search-container">
                    <input ref="searchInput" value={searchText} autoFocus={true} onBlur={that.onBlurSearchInput}
                           onChange={that.onSearcherChange} onKeyDown={that.onKeyDown}/>
                    <div className="ic_back" onClick={that.quitGlobalSearch}></div>

                    {
                        searchText ?
                            <div className="ic_delete" onClick={that.onClearSearchText}></div> :
                            <span></span>
                    }

                </div>
            </div>
        );
    }

}