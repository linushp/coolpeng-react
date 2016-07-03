import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchProfile, logout} from '../../actions/user';

import './index.less';


class ArticleList extends React.Component {
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
            <div className="article-list">
                List
            </div>
        );
    }
}

ArticleList.propTypes = {
    user: PropTypes.object
};

ArticleList.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const {user} = state;
    return {
        user: user ? user : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({fetchProfile, logout}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
