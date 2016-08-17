import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import {connect} from 'react-redux';
import {isAdmin} from '../../core/utils';


function formInput(name,text){
    return (
        <label>
            <span>{text}</span>
            <input className="formInput" name={name} type="text" />
        </label>
    );
}

function formSelect(name,text,options){
    return (
        <label>
            <span>{text}</span>
            <select className="formInput" name={name}>
                {options}
            </select>
        </label>
    );
}


export default class CreateDaohang extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onSubmitAddLink(){
        var from  = this.refs['form'];
        var values = {};
        $(from).find('.formInput').each(function(){
            var $this = $(this);
            var v = $this.val();
            var name = $this.attr('name');
            values[name] = v;
        });
        const {user, actions,parent} = this.props;
        actions.insertOrUpdateDhItem({DhItem:values},function(){
            parent.refreshCategoryList();
            $(from).find('input').val('');
        });
    }

    onSubmitAddCategory(){
        var from  = this.refs['form2'];
        var values = {};
        $(from).find('input').each(function(){
            var $this = $(this);
            var v = $this.val();
            var name = $this.attr('name');
            values[name] = v;
        });
        const {user, actions,parent} = this.props;
        actions.insertOrUpdateDhCategory({DhCategory:values},function(){
            parent.refreshCategoryList()
        });
    }

    render() {
        const {user, actions,daohang} = this.props;

        if(!isAdmin(user)){
            return <div></div>
        }

        var categoryList = daohang.get("categoryList") || [];
        var selectOptions = categoryList.map(function(c){
            var text = c.get('text');
            var id = c.get('id');
            return <option value={id}>{text}</option>
        });

        return (
            <div>

                <div className="cp-dh-create1">
                    <div ref="form">
                        {formSelect('categoryId','分类',selectOptions)}
                        {formInput('text','文字')}
                        {formInput('desc','描述')}
                        {formInput('link','链接')}
                    </div>
                    <button onClick={this.onSubmitAddLink.bind(this)}>添加链接</button>
                </div>

                <div className="cp-dh-create2">
                    <div ref="form2">
                        {formInput('text','文字')}
                        {formInput('desc','描述')}
                    </div>
                    <button onClick={this.onSubmitAddCategory.bind(this)}>添加分类</button>
                </div>

            </div>

        );
    }
}


