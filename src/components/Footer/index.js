import React from 'react'

import './index.less'

export default class Footer extends React.Component {
  constructor () {
    super()
  }

  render () {

    return (
      <div className="ant-layout-footer">
        <div className="page-content">
           版权所有 © 2016 coolpeng.cn
        </div>
      </div>
    )
  }
}
