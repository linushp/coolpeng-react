import React,{PropTypes} from 'react'
import './CreateGroupButton.less';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import immutable from 'immutable';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
const hideStyle = RebixUtils.hideStyle;

/**
 * 创建群组下方的那个按钮
 */
export default class CreateGroupButton extends PureRenderComponent {

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        isShow: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    render() {
        var {isShow,isLoading,onClick} = this.props;
        return (
            <div className="createGroupButtonWrapper" style={hideStyle(!isShow)}>
                <div className="createButton" style={hideStyle(isLoading)} onClick={onClick} >
                    <div className="ic_right_white"></div>
                </div>
                <div className="createButton loading" style={hideStyle(!isLoading)} >
                    <div className="ic_loading"></div>
                </div>
            </div>
        );
    }

}
