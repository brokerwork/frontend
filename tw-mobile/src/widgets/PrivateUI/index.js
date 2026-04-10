/**
 * 私密模块
 */
import React from 'react'

class PrivateUI extends React.Component { 
    constructor() { 
        super()
    }
    render() { 
        let { visible = true } = this.props
        return (
            visible ? <div>{this.props.children}</div> : null
        )
    }
}

export default PrivateUI