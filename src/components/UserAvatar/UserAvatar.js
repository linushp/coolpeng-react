import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
import './UserAvatar.less';

const UserAvatar = createPureComponent(function (props) {
    var {avatar,size ,onClick,className} = props;
    size = size || 80;
    var sizeStyle = {
        width: size, height: size
    };

    var otherProps = {};
    if (onClick) {
        otherProps['onClick'] = onClick;
    }

    return (
        <div className={`comp-UserAvatar ${className || ''}`} style={sizeStyle} {...otherProps}>
            <img src={avatar} style={sizeStyle}/>
        </div>
    );
});


export default UserAvatar;