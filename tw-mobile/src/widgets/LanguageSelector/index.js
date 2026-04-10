import React, { Component } from 'react'

import icon_44 from 'images/44.png'
import icon_86 from 'images/86.png'
import icon_886 from 'images/886.png'
import icon_81 from 'images/81.png'
import icon_dropdown from 'images/icon_dropdown.png'

import css from './index.less'

const selectVal = {
    'zh-CN': {
        word: '中',
        icon: icon_86
    },
    'en-US': {
        word: 'En',
        icon: icon_44
    },
    'zh-TW': {
        word: '繁',
        icon: icon_886
    },
    'ja-JP': {
        word: '日',
        icon: icon_81
    }
}

class LanguageSelector extends Component {
    constructor(props) { 
        super(props)
        this.state = {
            language: props.defaultLanguage || 'zh-CN'
        }
    }

    selectLanguage = (e) => { 
        const { turnLanguage } = this.props
        let val = e.target.value
        this.setState({
            language: val
        })
        turnLanguage && turnLanguage(val)
    }

    render() {
        return (
            <div className={css['selector-wrap']}>
                <img src={selectVal[this.state.language]['icon']} className={css['icon_left']} />
                <span className={css['word']}>{selectVal[this.state.language]['word']}</span>
                <img src={icon_dropdown} className={css['icon_right']} />
                <select
                    defaultValue={this.state.language}    
                    className={css['select']}
                    onChange={this.selectLanguage}>
                    <option value='zh-CN'>简体中文</option>
                    <option value='en-US'>English</option>
                    <option value='zh-TW'>繁体中文</option>
                    <option value='ja-JP'>日本語</option>
                </select>
            </div>
        )
    }
}

export default LanguageSelector