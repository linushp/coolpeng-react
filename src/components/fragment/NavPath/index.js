import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './index.less'

const defaultProps = {
  navpath: []
}

const propTypes = {
  navpath: PropTypes.array
}

class NavPath extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="ant-layout-breadcrumb">

      </div>
    )
  }
}

NavPath.propTypes = propTypes;
NavPath.defaultProps = defaultProps;

function mapStateToProps(state) {

  return {
    navpath: state.menu.navpath
  }
}

export default connect(mapStateToProps)(NavPath)
