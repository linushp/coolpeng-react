import React from 'react'
import PanelBox from '../../components/PanelBox';
import AvatarReact from '../../service/avatar/AvatarReact';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setCurrentTempUser} from '../../actions/user';

import './index.less'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      x:0
    };
  }

  componentWillMount () {
  }

  callback() {
    var x = this.state.x;

    this.setState({x:(x +1)});
  }

  render () {
      var actions = this.props.actions;
      var user = this.props.user || {};
    return (
        <div>
          <button onClick={this.callback.bind(this)}>mmmmm</button>
          <AvatarReact user={user} actions={actions}></AvatarReact>
        </div>
    );
  }
}



const mapStateToProps = (state) => {
    const {user} = state;
    return {
        user: user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions:{
            setCurrentTempUser: bindActionCreators(setCurrentTempUser, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);