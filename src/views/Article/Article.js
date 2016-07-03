import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchProfile, logout} from '../../actions/user';
import ArticleSideBar from './ArticleSideBar';
import './index.less';

class Article extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.fetchProfile();
    }

    render() {
        const {user, actions} = this.props;
        return (
            <div className="article-page">
                <div className="article-menu">
                    <ArticleSideBar data={this.props.articleSideBar}></ArticleSideBar>
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
    const {user,articleSideBar} = state;
    return {
        articleSideBar:articleSideBar ||{},
        user: user ? user : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({fetchProfile, logout}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
