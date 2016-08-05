import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

export default class CreateDaohang extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onSubmit(){
        var from  = this.refs['form'];
        var values = {};
        $(from).find('input').each(function(){
            var $this = $(this);
            var v = $this.val();
            var name = $this.attr('name');
            values[name] = v;
        });
        const {user, actions,refreshCategoryList} = this.props;
        actions.insertOrUpdateDhItem({DhItem:values},function(){
            refreshCategoryList()
        });

    }

    onSubmit2(){
        var from  = this.refs['form2'];
        var values = {};
        $(from).find('input').each(function(){
            var $this = $(this);
            var v = $this.val();
            var name = $this.attr('name');
            values[name] = v;
        });
        const {user, actions,refreshCategoryList} = this.props;
        actions.insertOrUpdateDhCategory({DhCategory:values},function(){
            refreshCategoryList()
        });

    }

    render() {
        const {user, actions} = this.props;
        return (
            <div>
                <div>
                    <div ref="form">
                        <input name="categoryId" type="text" />
                        <input name="text" type="text" />
                        <input name="desc" type="text" value="1" />
                        <input name="link" type="text" value="1" />
                        <input name="order" type="text" value="1" />
                        <input name="type" type="text" value="1" />
                    </div>
                    <button onClick={this.onSubmit.bind(this)}>添加</button>
                </div>

                <div>
                    <div ref="form2">
                        <input name="text" type="text" />
                        <input name="desc" type="text" value="1" />
                        <input name="link" type="text" value="1" />
                        <input name="order" type="text" value="1" />
                        <input name="type" type="text" value="1" />
                    </div>
                    <button onClick={this.onSubmit2.bind(this)}>添加</button>
                </div>

            </div>

        );
    }
}


