import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchProfile, logout} from '../../actions/user';
import './index.less';


class ArticleSingle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {
        const {user, actions} = this.props;


        return (
            <div className="article-sidebar">
                Sidebar
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    const {user} = state;
    return {
        user: user ? user : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({fetchProfile, logout}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleSingle);
