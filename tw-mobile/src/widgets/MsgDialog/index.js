import React, { Component } from 'react'

import css from './index.less'

class MsgDialog extends Component { 

    componentDidMount() { 
        let { closeMsgDialog, closeTime=1700 } = this.props
        setTimeout(() => {
            closeMsgDialog()
        }, closeTime)
    }

    render() {
        let { msg, color='#fff', fontSize='14px' } = this.props
        return (
            <div
                style={{ color: color, fontSize: fontSize, textAlign: 'center' }}
                className={css['popup']}>
                {msg}
            </div>
        )
    }

}

export default MsgDialog