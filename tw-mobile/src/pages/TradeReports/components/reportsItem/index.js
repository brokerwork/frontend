import React from 'react'

import i18n from 'utils/i18n'

import css from './index.less'
import 'less/common.less'
import more from 'images/more.png'

class ReportsItem extends React.Component { 
    constructor() { 
        super()
        this.state = {

        }
    }

    render() {
        let { wrapStyle, id, type, variety, count, onTouchTap} = this.props
        return (
            <div className={css['item-wrap']} style={wrapStyle} onTouchTap={onTouchTap}>
                <div className={`${css['item-top']} flex-align-between`}>
                    <span>{i18n['tradereport.order.number']}: <span className={css['item-account']}>{id}</span></span>
                    <img src={more} className={css['item-icon']}/>
                </div>
                <div className={`${css['item-bottom']} flex-align`}>
                    <span className={css['item-bottom-tit']}>{i18n['tradereport.type']}: <span >{type}</span></span>
                    <span className={css['item-bottom-tit']}>{i18n['tradereport.variety']}: <span>{variety}</span></span>
                    <span className={css['item-bottom-tit']}>{i18n['tradereport.volum']}: <span>{count}</span></span>
                </div>
            </div>
        )
    }
}

export default ReportsItem