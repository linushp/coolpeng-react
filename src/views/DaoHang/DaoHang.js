import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PureRenderComponent from '../../core/PureRenderComponent';
import daohangActions from '../../actions/daohang';

import DaohangCreate from './DaohangCreate';
import DaoHangCategory from './DaoHangCategory';

class DaoHang extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {daohang} = this.props;
        this.refreshCategoryList();
    }

    refreshCategoryList(){
        const {actions} = this.props;
        actions.getCategoryList({type: 1});
    }

    renderCategoryList(categoryList) {
        const {user, daohang, actions} = this.props;
        var result = [];
        categoryList.forEach(function (c, i) {
            result.push(<DaoHangCategory category={c} user={user} actions={actions}></DaoHangCategory>);
        });
        return result;
    }

    render() {
        const {user, daohang, actions} = this.props;
        var categoryList = daohang.get("categoryList") || [];
        return (
            <div>
                <DaohangCreate daohang={daohang} user={user} actions={actions} refreshCategoryList={this.refreshCategoryList.bind(this)}></DaohangCreate>
                <div>
                    {this.renderCategoryList(categoryList)}
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
        daohang: daohang
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(daohangActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(DaoHang);
