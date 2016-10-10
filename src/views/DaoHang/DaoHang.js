import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import DaohangCreateButton from './DaohangCreateButton';
import DaoHangCategory from './DaoHangCategory';
import GoogleSearch from './GoogleSearch';
import {isAdmin,displayControl} from '../../core/utils';
import './index.less';

class DaoHang extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            isEditing:false
        };
    }

    componentDidMount() {
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
        var isEditing = this.state.isEditing;
        categoryList.forEach(function (c, i) {
            result.push(<DaoHangCategory category={c} isEditing={isEditing} user={user} actions={actions} parent={that}></DaoHangCategory>);
        });
        return result;
    }

    render() {

        if (!this.isDataOk()) {
            return <div>loading...</div>
        }

        const {user, daohang, actions} = this.props;
        var categoryList = daohang.get("categoryList") || [];
        var isAdminUser = isAdmin(user);
        var adminControl = displayControl.bind(this,isAdminUser);
        return (
            <div className="cp-daohang">
                <GoogleSearch></GoogleSearch>
                <div className="cp-daohang-create">
                    {adminControl(
                        this.state.isEditing?
                            <button className="cp-daohang-create-button" onClick={()=>{this.setState({isEditing:false})}}>完成</button> :
                            <button className="cp-daohang-create-button" onClick={()=>{this.setState({isEditing:true})}}>编辑</button>
                    )}
                    <DaohangCreateButton daohang={daohang} user={user} actions={actions} parent={this}></DaohangCreateButton>
                </div>
                <div className="cp-daohang-ccs">
                    {this.renderCategoryList(categoryList)}
                </div>
                <div className="clear"></div>
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
