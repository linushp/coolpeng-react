import React, {Component, PropTypes} from 'react';

/**
 * 双状态切换的"进入/退出"动画
 *
 * 类似于 ReactCSSTransitionGroup, 子节点成功渲染时组件会在下一刻添加"active"(默认)className,
 * 通过控制active样式达到进入/退出切换的效果
 */
export default class AnimatorInAndOut extends Component {
    static propTypes = {
        children: PropTypes.node,

        className: PropTypes.string,
        leaveDuration: PropTypes.number, // 指定转变成非active状态后的子节点保留时间(用以显示动画)
        activeClassName: PropTypes.string, // active=true 时会添加的 class
        style: PropTypes.object
    };
    static defaultProps = {
        leaveDuration: 500,
        activeClassName: 'active'
    };

    constructor() {
        super(...arguments);
        this._timer = null;
        this.state = {
            children: null,
            active: false
        };
    }


    onReceiveProps(nextProps) {
        const state = this.state;
        const {leaveDuration, children: nextChildren} = nextProps,
            nextActive = !!nextChildren;

        if (nextActive) {
            this.setState({
                children: nextProps.children
            });
        }

        if (state.active !== nextActive) {
            clearTimeout(this._timer);

            if (nextActive) {
                this.setState({
                    children: nextProps.children
                }, () => {
                    setTimeout(() => this.setState({
                        active: true
                    }), 0);
                });
            } else {
                this.setState({
                    active: false
                });
                this._timer = setTimeout(() => this.setState({
                    children: null
                }), leaveDuration);
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
        const {className, activeClassName} = this.props,
            {children, active} = this.state;
        return (
            <span className={`animator ${className || ''} ${active ? activeClassName : ''}`} style={this.props.style}>
                {children}
            </span>
        );
    }
}
