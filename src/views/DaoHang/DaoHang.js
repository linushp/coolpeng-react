import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import daohangActions from '../../actions/daohang';

import CreateDaohang from './CreateDaohang';

class DaoHang extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.getCategoryList({type:1});
    }

    render() {
        const {user, daohang, actions} = this.props;
        return (
            <div>
                <CreateDaohang daohang={daohang} user={user} actions={actions} ></CreateDaohang>
                <div>

                </div>
            </div>
        );
    }
}



DaoHang.propTypes = {
    user: PropTypes.object
};

DaoHang.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const {user,daohang} = state;
    return {
        user: user,
        daohang:daohang
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(daohangActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DaoHang);
