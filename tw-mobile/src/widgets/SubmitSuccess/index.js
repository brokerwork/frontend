import React, { Component } from 'react'
import css from './index.less'

class SubmitSuccess extends Component {

    render() {
        const { title, des, img } = this.props
        return (
            <div className={css['sub-suc']}>
                <img src={img} className={css['suc-img']} />
                <div className={css['suc-tit-des']}>
                    <p className={css['suc-tit']}>{title}</p>
                    <p className={css['suc-des']}>{des}</p>
                </div>
            </div>
        )
    }
}

export default SubmitSuccess