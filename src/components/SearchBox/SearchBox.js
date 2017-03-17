/**
 * Created by luanhaipeng on 17/3/17.
 */



import React from 'react'
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const PureRenderComponent = RebixFlux.PureRenderComponent;
import './SearchBox.less';

export default class SearchBox extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    render() {
        var props = this.props;
        return (
            <div className="comp-SearchBox ActionArea">
                <div className="search-container">
                    <input {...props} />
                </div>
            </div>
        );
    }

}