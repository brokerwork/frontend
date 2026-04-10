import React, { Component } from 'react'

import css from './index.less'

class ItemDialog extends Component {
    constructor() { 
        super()
    }

    render() { 
        let { componentType, topData, middleData, botData } = this.props
        
        return (
            <div className={css['item-dialog-wrap']}>
                <div className={css['dialog-top']}>
                    {
                        topData.length > 0 && topData.map((item, index) => {
                            return (
                                <p key={index} className='flex-align-between'>
                                    <span className={css['dialog-tit']}>{item.key}:</span>
                                    <span className={css['dialog-val']}>{item.val}</span>
                                </p> 
                            )
                        })
                    }
                </div>
                <div className={css['dialog-line']}></div>
                <div className={css['dialog-middle']}>
                    {
                        middleData.length > 0 && middleData.map((item, index) => {
                            return (
                                <p key={index} className='flex-align-between'>
                                    <span className={css['dialog-tit']}>{item.key}:</span>
                                    <span className={css['dialog-val']}>{item.val}</span>
                                </p> 
                            )
                        })
                    }
                </div>
                <div className={css['dialog-line']}></div>
                <div className={css['dialog-bottom']}>
                    {
                        botData.length > 0 && botData.map((item, index) => {
                            return (
                                <p key={index} className='flex-align-between'>
                                    <span className={css['dialog-tit']}>{item.key}:</span>
                                    <span className={css['dialog-val']}>{item.val}</span>
                                </p> 
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default ItemDialog