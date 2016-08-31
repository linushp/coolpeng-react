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
        var {type,icon,disabled} = this.props;

        var className = '';

        if (type && type.length > 0) {
            className = `cp-sprite cp-sprite-${type}  `;
        }
        else if (icon && icon.length > 0) {
            className = `icon-${icon}  `;
        }

        if (disabled) {
            className += " disabled ";
        }

        className += (this.props.className || "");
        var style = this.props.style || {};
        if (this.props.onClick) {
            return (<i className={className} style={style} onClick={this.onClickIcon.bind(this)}></i>);
        } else {
            return (<i className={className} style={style}></i>);
        }

    }
}