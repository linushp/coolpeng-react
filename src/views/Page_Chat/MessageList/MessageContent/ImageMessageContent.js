import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;


export default class ImageMessageItem extends PureRenderComponent{

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="ImageMessageItem">

            </div>
        )
    }
}