import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

export default class CreateDaohang extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        const {user, actions} = this.props;
        return (
            <div>

            </div>
        );
    }
}


