import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getAllModuleList} from '../../actions/article';
import ArticleSideBar from './ArticleSideBar';
import './index.less';

class Article extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.getAllModuleList()
    }

    render() {
        const {user, actions} = this.props;
        return (
            <div className="article-page">
                <div className="article-menu">
                    <ArticleSideBar data={this.props.article} actions={this.props.actions}></ArticleSideBar>
                </div>
                <div className="article-container">
                    {this.props.children}
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}

Article.propTypes = {
    user: PropTypes.object,
    children: PropTypes.node.isRequired
};

Article.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const {article} = state;
    return {
        article:article || {}
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({getAllModuleList}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
