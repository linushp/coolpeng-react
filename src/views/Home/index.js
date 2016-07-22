import React from 'react'
import PanelBox from '../../components/PanelBox';
import AvatarReact from '../../service/avatar/AvatarReact';

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

export default class Home extends React.Component {
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
    var x = this.state.x;
    if (x%2===0){
      return (
          <div>
            <button onClick={this.callback.bind(this)}>mmmmmmm</button>
          </div>);
    }
    return (
        <div>
          <button onClick={this.callback.bind(this)}>mmmmm</button>
          <AvatarReact></AvatarReact>
        </div>
    );
  }
}
