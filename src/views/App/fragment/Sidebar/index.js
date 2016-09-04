import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getAllMenu, updateNavPath } from '../../../../actions/menu'

import './index.less'


class Sidebar extends React.Component {
  constructor (props) {
    super(props)

  }
  componentDidMount () {
  }


  render () {
    var {user} = this.props;
    var {userInfo,isLogged} = user;
     return (
         <div className="cp-sidebar">

           <div className="avatar-wrapper">
               <div className="avatar-bg1"></div>
               <img className="avatar" src={userInfo.avatar} />
               <div className="avatar-bg2"></div>
           </div>

           <div class="side-menus">
               {this.props.sidebar}
           </div>

         </div>
     )
  }
}


function mapStateToProps(state) {
  return {
    //items: state.menu.items,
    //currentIndex: state.menu.currentIndex
  }
}

function mapDispatchToProps(dispatch,ownProps) {
  return {
    //getAllMenu: bindActionCreators(getAllMenu, dispatch),
    //updateNavPath: bindActionCreators(updateNavPath, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
