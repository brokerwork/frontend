import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions'
import * as commonActions from 'common/commonActions'
import i18n from 'utils/i18n'

import css from './index.less'
import iconDown from 'images/icon_down.png'

class RenderCity extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            country: props.countryCache[0],
            province: [], 
            city: [], 
            id: props.item.key
        }
    }

    countryChange = (e) => {
        const { countryCache, updateErrText, errText, formData, updateFormData, item } = this.props
        const { id } = this.state
        let val = e.target.value
        
        updateFormData({
            ...formData,
            [id]: {
                country: val,
                province: '',
                city: ''
            }
        })
        updateErrText({
            ...errText,
            [id]: !val && item.validateType && item.validateType.required ? i18n['mobile.must.select'] : ''
        })
        if (val) {
            this.setState({
                province: countryCache[val] || [{}],
                city: [{}]
            })
        } else { 
            this.setState({
                province: [{}],
                city: [{}]
            })
        }
    }

    provinceChange = (e) => { 
        const { countryCache, formData, updateFormData } = this.props
        const { id } = this.state
        let val = e.target.value
        updateFormData({
            ...formData,
            [id]: {
                country: formData[id]&&formData[id]['country'] || '',
                province: val,
                city: ''
            }
        })
        if (val) {
            this.setState({
                city: countryCache[val]
            })
        } else { 
            this.setState({
                city: [{}]
            })
        }
    }

    cityChange = (e) => { 
        const { formData, updateFormData } = this.props
        const { id } = this.state
        let val = e.target.value
        updateFormData({
            ...formData,
            [id]: {
                country: formData[id]&&formData[id]['country'] || '',
                province: formData[id]&&formData[id]['province'] || '',
                city: val
            }
        })
    }

    render() {
        const { country, province, city, id } = this.state
        const { formData, item, errText, countryCache, firstInfo } = this.props
        return (
            <div style={{ height: '100%' }}>
                <div className={`${css['addr-container']} ${css['select-container']}`}>
                    <select
                        value={formData[id] && formData[id]['country'] || ''}
                        onChange={this.countryChange}>
                        {
                            <option value='' disabled>{i18n['general.select']}</option>
                        }
                        {
                            country && country.length && country.map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                        }
                    </select>
                    <img className={css['img2']} src={iconDown} />
                </div>
                <div className={`${css['addr-container']} ${css['select-container']}`}>
                    <select
                        value={formData[id]&&formData[id]['province'] || ''}
                        onChange={this.provinceChange}>
                        {
                            <option value='' disabled>{i18n['general.select']}</option>
                        }
                        {
                            province && province.length
                                ?
                            province.map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                                :
                            formData && formData[id] && countryCache && countryCache[formData[id]['country']] && countryCache[formData[id]['country']].map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                        }
                    </select>
                    <img className={css['img2']} src={iconDown} />
                </div>
                <div className={`${css['addr-container']} ${css['select-container']}`}>
                    <select
                        value={formData[id]&&formData[id]['city'] || ''}
                        onChange={this.cityChange}>
                        {
                            <option value='' disabled>{i18n['general.select']}</option>
                        }
                        {
                            city && city.length
                                ?
                            city.map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                                :
                            formData && formData[id] && countryCache && countryCache[formData[id]['province']] && countryCache[formData[id]['province']].map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                        }
                    </select>
                    <img className={css['img2']} src={iconDown} />
                </div>
                {
                    errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                }
            </div>
        )
    }
}

export default connect(
    ({ common, openAcctStepPage, formData }) => ({
        formData: formData,
        errText: openAcctStepPage.errText,
    }), ({ ...actions, ...commonActions })
)(RenderCity)