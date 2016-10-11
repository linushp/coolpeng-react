import React, {Component, PropTypes} from 'react';

/**
 * 双状态切换的"进入/退出"动画
 *
 * 类似于 ReactCSSTransitionGroup, 子节点成功渲染时组件会在下一刻添加"active"(默认)className,
 * 通过控制active样式达到进入/退出切换的效果
 */
export default class LeftPanelAnimator extends Component {
    static propTypes = {
        children: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
        nextActive: PropTypes.bool,
        activeClassName: PropTypes.string
    };


    constructor() {
        super(...arguments);
        this._timer = null;
        this.state = {
            active: false
        };
    }


    onReceiveProps(nextProps) {
        const state = this.state;
        var nextActive = nextProps.nextActive;

        if (state.active !== nextActive) {
            clearTimeout(this._timer);
            if (nextActive) {
                setTimeout(() => this.setState({
                    active: true
                }), 1);
            } else {
                this.setState({
                    active: false
                });
            }
        }
    }


    componentWillMount() {
        this.onReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.onReceiveProps(nextProps);
    }

    render() {
        const {className, activeClassName,children,style} = this.props;
        const {active} = this.state;
        return (
            <div className={`${className || ''} ${active ? activeClassName : ''}`}  style={style}>
                {children}
            </div>
        );
    }
}
