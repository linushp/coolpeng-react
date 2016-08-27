import React from 'react';
import PureRenderComponent from '../../core/PureRenderComponent';
import "./icons.less";
export default class Icon extends PureRenderComponent{
    constructor(props) {
        super(props);
    }

    onClickIcon(){
        this.props.onClick();
    }

    render() {
        var type = this.props.type;
        var disabled = this.props.disabled;
        var className = `cp-sprite cp-sprite-${type} `;
        if(disabled){
            className +="disabled ";
        }
        className +=(this.props.className || "");
        var style = this.props.style ||{};
        if(this.props.onClick){
            return (<i className={className} style={style} onClick={this.onClickIcon.bind(this)}></i>);
        }else {
            return (<i className={className} style={style}></i>);
        }

    }
}