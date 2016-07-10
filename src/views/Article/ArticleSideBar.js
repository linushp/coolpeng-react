import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchProfile, logout} from '../../actions/user';
import './index.less';


class ArticleSingle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {
        const {data, actions} = this.props;
        var moduleList = data.moduleList || [];
        return (
            <div className="article-sidebar">
                {moduleList.map(function(m){
                    return <div>{m.moduleName}</div>
                })}
            </div>
        );
    }
}



export default ArticleSingle;
