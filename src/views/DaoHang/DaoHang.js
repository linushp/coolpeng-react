import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PureRenderComponent from '../../core/PureRenderComponent';
//import daohangActions from '../../actions/daohang';
import DaohangCreate from './DaohangCreate';
import DaoHangCategory from './DaoHangCategory';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import './index.less';

class DaoHang extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (!this.isDataOk()) {
            this.refreshCategoryList();
        }
    }

    isDataOk() {
        const {daohang} = this.props;
        if (!daohang || !daohang.get('categoryList') || daohang.get('categoryList').size === 0) {
            return false;
        }
        return true;
    }

    refreshCategoryList() {
        const {actions} = this.props;
        actions.getCategoryList({type: 1});
    }

    renderCategoryList(categoryList) {
        var that = this;
        const {user, daohang, actions} = this.props;
        var result = [];
        //refreshCategoryList={that.refreshCategoryList.bind(that)}
        categoryList.forEach(function (c, i) {
            result.push(<DaoHangCategory category={c} user={user} actions={actions} parent={that}></DaoHangCategory>);
        });
        return result;
    }

    render() {

        if (!this.isDataOk()) {
            return <div></div>
        }

        const {user, daohang, actions} = this.props;
        var categoryList = daohang.get("categoryList") || [];
        return (
            <div className="cp-daohang">
                <div className="cp-daohang-create">
                    <DaohangCreate daohang={daohang} user={user} actions={actions} parent={this}></DaohangCreate>
                </div>
                <div className="cp-daohang-ccs">
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

DaoHang.STATE_CONFIG = {
    user: 'user',
    daohang: 'daohang'
};

DaoHang.ACTION_CONFIG = ['daohang!'];

export default ActionStoreHelper()(DaoHang);
