import React, { Component } from 'react'

import './index.less'

class StopServerNotice extends Component {
    constructor() { 
        super()
    }

    closeNotice = () => { 
        const { close } = this.props
        close && close()
    }

    render() {
        const { notice } = this.props

        return (
            <div>
                {
                    notice ? <div className="notice-top">
                        <span className="iconfont icon-icon_Warning notice-warning"></span>
                        <span className="notice-word">{notice}</span>
                        <span onClick={this.closeNotice} className="iconfont icon-close01 notice-close"></span>
                    </div> : null
                }
            </div>
        )
    }
}

export default StopServerNotice