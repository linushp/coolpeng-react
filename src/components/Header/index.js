import React from 'react'
import './index.less'
import {Link} from 'react-router'

export default class Header extends React.Component {
    constructor() {
        super()
    }

    handleClick() {

    }

    render() {
        const {user} = this.props;
        return (
            <div className='ant-layout-header'>

                <div className='page-content'>
                    <h1 className="my-logo float-l" >
                        <a href="/">
                            <span className="text">coolpeng</span>
                        </a>
                    </h1>
                    <div className="float-l">
                        
                    </div>
                    <div className="float-r login-btn">
                        <span>注册&nbsp;/&nbsp;登录</span>
                    </div>
                    <div className="clear"></div>
                </div>

            </div>
        )
    }
}
