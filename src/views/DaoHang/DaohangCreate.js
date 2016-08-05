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
        const {user, actions} = this.props;
        actions.insertOrUpdateDhItem({DhItem:values});

    }

    render() {
        const {user, actions} = this.props;
        return (
            <div>
                <div ref="form">
                    <input name="categoryId" type="text" />
                    <input name="text" type="text" />
                    <input name="desc" type="text" />
                    <input name="link" type="text" />
                    <input name="order" type="text" />
                    <input name="type" type="text" />
                </div>
                <button onClick={this.onSubmit.bind(this)}>添加</button>
            </div>
        );
    }
}


