import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import PureRenderComponent from '../../core/PureRenderComponent';
import ReactForm, {getReactFormValues} from '../../components/form/ReactForm';
import $ from 'jquery';
import {uniqueId, className} from '../../core/utils';

var CONST_FORM_UNIQUE_ID = "tabContentFormUniqueId";


export default class CreateDaohangDialog extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {
            tab: "addLink"
        };
        this.tabContentAddLinkUniqueId = uniqueId(CONST_FORM_UNIQUE_ID);
        this.tabContentAddCategoryUniqueId = uniqueId(CONST_FORM_UNIQUE_ID);

        props.api.getCurrentTabFormValues = this.getCurrentTabFormValues.bind(this);
    }


    getCurrentTabFormValues() {
        var values;
        if (this.state.tab === "addLink") {
            values = getReactFormValues(this.tabContentAddLinkUniqueId);
        }
        else {
            values = getReactFormValues(this.tabContentAddCategoryUniqueId);
        }

        return {
            values:values,
            curTab:this.state.tab
        };
    }


    render() {
        var state = this.state;
        var curTab = state.tab;
        var categoryList = this.props.categoryList || [];//{id,text}
        var tabContentAddLinkLayout = [
            {name: 'categoryId', type: 'select', text: "分类", options: categoryList},
            {name: 'text', type: 'input', text: "文字"},
            {name: 'link', type: 'input', text: "链接"},
            {name: 'desc', type: 'textarea', text: "描述"}
        ];
        var tabContentAddCategoryLayout = [
            {name: 'text', type: 'input', text: "文字"},
            {name: 'desc', type: 'textarea', text: "描述"}
        ];

        return (
            <div>
                <div className="tabGroup">
                    <div className={className({'tabItem':true,"tabItemActive":curTab=="addLink"})}
                         onClick={()=>{this.setState({"tab":"addLink"})}}>添加链接
                    </div>
                    <div className={className({'tabItem':true,"tabItemActive":curTab=="addCategory"})}
                         onClick={()=>{this.setState({"tab":"addCategory"})}}>添加分类
                    </div>
                </div>

                <div className={className({'tabContent':true,"tabContentActive":curTab=="addLink"})}>
                    <ReactForm id={this.tabContentAddLinkUniqueId} layout={tabContentAddLinkLayout}></ReactForm>
                </div>

                <div className={className({'tabContent':true,"tabContentActive":curTab=="addCategory"})}>
                    <ReactForm id={this.tabContentAddCategoryUniqueId} layout={tabContentAddCategoryLayout}></ReactForm>
                </div>

            </div>

        );
    }

}
