import React from 'react';
import ReactDOM from 'react-dom';

// 将子组件渲染到 document.body 上
export default class RenderToBody extends React.Component {
    static propTypes = {
        children: React.PropTypes.node.isRequired // 只允许传单个子组件
    };

    componentDidMount() {
        this._innerContainer = document.createElement('div');
        document.body.appendChild(this._innerContainer);
        this._renderLayer();
    }

    componentDidUpdate() {
        this._renderLayer();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this._innerContainer);
        document.body.removeChild(this._innerContainer);
        this._innerContainer = null;
    }

    _renderLayer() {
        ReactDOM.render(React.Children.only(this.props.children), this._innerContainer);
    }


    render() {
        // Render a placeholder
        return <span/>;
    }

}
