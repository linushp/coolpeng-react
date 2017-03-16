import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import './SelectedAndSearch.less';

export default class SelectedAndSearch extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var {userList,selectedUidMap,isMultiSelect} = this.props;
        return (
            <div className="SelectedAndSearch">

            </div>
        )
    }
}
