import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import DaohangCreateButton from './DaohangCreateButton';
import DaoHangCategory from './DaoHangCategory';
import {isAdmin,displayContro,getStaticImages} from '../../core/utils';
import './index.less';

export default class GoogleSearch extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="cp-daohang-google">
                <form action="http://gg.qwghq.com/search" method="get" target="_blank">
                    <img className="googlelogo" src={getStaticImages('googlelogo.png')} alt="" />
                    <input type="hidden" name="hl" value="zh-CN" />
                    <input className="inputbox" name="q" placeholder="Google搜索" type="text" />
                    <input className="submit" type="submit" value="Search" />
                </form>
            </div>
        );
    }
}

