//import avatarView from '../../src/service/avatar/avatarView';

import AvatarReact from '../../src/service/avatar/AvatarReact';

import React from 'react';
import ReactDOM from 'react-dom';

import {Button,Icon} from 'antd';

import AvatarView from '../../src/service/avatar/avatarView';


ReactDOM.render(
    <div>
        <AvatarReact></AvatarReact>
        速度比较法收到不放假多喝水
        <Button type="primary" size="large"><Icon type="apple" />Large</Button>
    </div>,
    document.getElementById('root')
);

