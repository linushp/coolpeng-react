import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import RenderToBody from '../RenderToBody';
import PureRenderComponent from '../../core/PureRenderComponent';

class CarouselItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render(){
        var onMove = this.props.onMove;
        return (
            <div className="CarouselItem">
                <div className="CarouselItemPre"  onClick={onMove(false)}>Pre</div>
                <div className="CarouselItemContent">{this.props.children}</div>
                <div className="CarouselItemNext" onClick={onMove(true)}>Next</div>
            </div>
        );
    }
}


class ReactCarousel extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        var currProps = this.props;
        if (
            currProps !== nextProps ||
            currProps.show !== nextProps.show ||
            currProps.children !== nextProps.children ||
            currProps.name !== nextProps.name
        ) {
            this.setState({currentIndex: 0});
        }
    }


    onMove(isNext) {
        var currentIndex = this.state.currentIndex;
        if (isNext) {
            currentIndex = currentIndex + 1;
        } else {
            currentIndex = currentIndex - 1;
        }
        this.setState({currentIndex: currentIndex});
    }


    render() {
        var isShow = this.props.show;
        var name = this.props.name;
        var children = this.props.children;



        var childrenSize = children.length;
        var style = {
            display: 'none'
        };
        if (isShow) {
            style['display'] = 'block';
        }
        style['left'] = (100 * this.state.currentIndex) + "%";
        var that = this;
        return (
            <RenderToBody>
                <div style={style}>
                    {
                        React.Children.map(children, function (child, index) {
                            return (
                                <CarouselItem
                                    onMove={that.onMove.bind(that)}
                                    key={name + '' +index}
                                    childrenSize={childrenSize}
                                    index={index}>{child}</CarouselItem>
                            );
                        })
                    }
                </div>
            </RenderToBody>
        );
    }
}
