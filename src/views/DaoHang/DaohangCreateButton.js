import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import PureRenderComponent from '../../core/PureRenderComponent';
import CreateDaohangDialog from './CreateDaohangDialog';
import {connect} from 'react-redux';
import {isAdmin, className} from '../../core/utils';
import Dialog from '../../components/dialog/Dialog';


export default class CreateDaohang extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onClickCreateButton(user, actions, daohang, parent) {
        var categoryList = daohang.get("categoryList") || [];
        var api = {};
        var content = <CreateDaohangDialog categoryList={categoryList} api={api}></CreateDaohangDialog>;
        var popClass = "cp-dialog-pop-tab";
        var popStyle = {width: 600, height: 400};
        var buttons = [
            {text: '添加', name: 'ok', cls: 'primary', action: 'close'},
            {text: '关闭', name: 'cancel', cls: '', action: 'close'}
        ];
        var callback = function (btn, dialog, doCloseDialog) {
            if(btn.name==='ok'){
                var m = api.getCurrentTabFormValues();
                var values = m.values;
                if (m.curTab === "addLink") {
                    actions.insertOrUpdateDhItem({DhItem: values}, function () {
                        parent.refreshCategoryList();
                        Dialog.showMsgSuccess("创建链接成功");
                    });
                } else {
                    values["type"]=1;
                    actions.insertOrUpdateDhCategory({DhCategory: values}, function () {
                        parent.refreshCategoryList();
                        Dialog.showMsgSuccess("创建分类成功");
                    });
                }
            }else {
                doCloseDialog();
            }
        };
        //content,callback,title, buttons, popStyle, popClass,closeControl
        Dialog.showModal(content, callback, null, buttons, popStyle, popClass, true);
    }

    render() {
        const {user, actions, daohang, parent} = this.props;
        if (!isAdmin(user)) {
            return <div></div>
        }
        return (
            <button className="cp-daohang-create-button"
                    onClick={this.onClickCreateButton.bind(this,user,actions,daohang,parent)}>新建</button>
        );
    }
}


