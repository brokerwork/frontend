import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Checkbox from 'material-ui/Checkbox'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import { isPhone, isEmail } from 'utils/validator'

import * as actions from '../../actions'
import * as commonActions from 'common/commonActions'

import RenderImg from '../renderImg'
import RenderCity from '../renderCity'
import i18n from 'utils/i18n'
import { languageCode, getType } from 'utils/language'

import css from './index.less'
import { TextFieldStyle, SelectFieldStyle, CheckBoxStyle } from './style'

import iconDown from 'images/icon_down.png'

class RenderFields extends Component {
    constructor() { 
        super()
        this.state = {
            
        }
    }

    componentDidMount() { 
        const {
            fieldList,
            formData,
            updateFormData,
            errText,
            updateErrText,
            isSame,
            sameInfo,
            stepInfo
        } = this.props
        let formDataObj = {}
        let errTextObj = {}

        if (isSame && sameInfo) {
            fieldList.forEach((item, index) => {
                formDataObj = {
                    [item.key]: sameInfo[item.key] || null,
                    ...formDataObj,
                    ...formData
                }
                errTextObj = {
                    [item.key]: '',
                    ...errTextObj
                }
            })
        } else {
            fieldList.forEach((item, index) => {
                formDataObj = {
                    [item.key]: (stepInfo && stepInfo[item.key]) || null,
                    ...formDataObj,
                    ...formData
                }
                errTextObj = {
                    [item.key]: '',
                    ...errTextObj
                }
            })
        }
        updateFormData(formDataObj)
        updateErrText(errTextObj)
    }

    renderFileds = (fieldList) => {
        return (
            fieldList && fieldList.length && fieldList.map((item, index) => {
                return this.renderItem(item, index)
            })
        )
    }

    //  必填项加 * 号
    renderLabel = (required, label) => { 
        return (
            <div className={css['render-label']}>
                {
                    required && <span className={css['xing']}>*</span>
                }
                <span>{label}</span>
            </div>
        )
    }

    renderItem = (item, index) => {
        let renderDom = null
        const {
            countryPhone,
            countryInfo,
            nationInfo,
            countryCache,
            updateFormData,
            formData,
            errText,
            updateErrText,
            isSame
        } = this.props
        switch (item.fieldType) {
            case 'text': {
                const changeText = (e) => {
                    updateFormData({
                        ...formData,
                        [e.target.id]: e.target.value
                    })
                    if (item.key == 'email') {
                        if (e.target.value) {
                            if (!isEmail(e.target.value)) {
                                updateErrText({
                                    ...errText,
                                    [e.target.id]: i18n['forgetpwd.errormsg.email.invalid']
                                })
                            } else { 
                                updateErrText({
                                    ...errText,
                                    [e.target.id]: ''
                                })
                            }
                        } else { 
                            updateErrText({
                                ...errText,
                                [e.target.id]: item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                            })
                        }
                    } else { 
                        updateErrText({
                            ...errText,
                            [e.target.id]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                        })
                    }
                }
                //  label 换行的处理
                if (item.columns >= 2) {
                    renderDom = <TextField
                        key={index}
                        id={item.key}
                        disabled={item.readonly}
                        errorText={errText[item.key]}
                        errorStyle={TextFieldStyle.errorStyle}
                        value={formData[item.key] || ''}
                        onChange={changeText}
                        style={TextFieldStyle.style2}
                        inputStyle={TextFieldStyle.inputStyle2}
                        underlineStyle={TextFieldStyle.underlineStyle}
                        underlineDisabledStyle={TextFieldStyle.underlineDisabledStyle}
                        floatingLabelStyle={TextFieldStyle.floatingLabelStyle2}
                        floatingLabelShrinkStyle={TextFieldStyle.floatingLabelShrinkStyle2}
                        hintStyle={TextFieldStyle.hintStyle}
                        floatingLabelText={this.renderLabel(item.validateType ? item.validateType.required : false, item.label)}
                        hintText={item.placeHolder}
                        />
                } else { 
                    renderDom = <TextField
                        key={index}
                        id={item.key}
                        disabled={item.readonly}
                        errorText={errText[item.key]}
                        errorStyle={TextFieldStyle.errorStyle}
                        value={formData[item.key] || ''}
                        onChange={changeText}
                        style={TextFieldStyle.style}
                        hintStyle={TextFieldStyle.hintStyle}
                        underlineDisabledStyle={TextFieldStyle.underlineDisabledStyle}
                        floatingLabelStyle={TextFieldStyle.floatingLabelStyle}
                        floatingLabelShrinkStyle={TextFieldStyle.floatingLabelShrinkStyle}
                        inputStyle={TextFieldStyle.inputStyle}
                        underlineStyle={TextFieldStyle.underlineStyle}
                        floatingLabelText={this.renderLabel(item.validateType ? item.validateType.required : false, item.label)}
                        hintText={item.placeHolder} />
                }
                break
            }
            case 'textarea': {
                const changeTextarea = (e) => { 
                    formData
                    updateFormData({
                        ...formData,
                        [e.target.id]: e.target.value
                    })
                    updateErrText({
                        ...errText,
                        [e.target.id]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                    })
                }
                renderDom = <TextField
                    key={index}
                    id={item.key}
                    disabled={item.readonly}
                    errorText={errText[item.key]}
                    errorStyle={TextFieldStyle.errorStyle}
                    onChange={changeTextarea}
                    value={formData[item.key] || ''}
                    style={TextFieldStyle.style}
                    hintStyle={TextFieldStyle.hintStyle}
                    underlineDisabledStyle={TextFieldStyle.underlineDisabledStyle}
                    floatingLabelStyle={TextFieldStyle.floatingLabelStyle}
                    floatingLabelShrinkStyle={TextFieldStyle.floatingLabelShrinkStyle}
                    inputStyle={TextFieldStyle.inputStyle}
                    underlineStyle={TextFieldStyle.underlineStyle}
                    floatingLabelText={this.renderLabel(item.validateType ? item.validateType.required : false, item.label)}
                    hintText={item.placeHolder} />
                break
            }    
            case 'select': { 
                const change = (e) => { 
                    updateFormData({
                        ...formData,
                        [e.target.id]: e.target.value
                    })
                    updateErrText({
                        ...errText,
                        [e.target.id]: e.target.value ? '' : i18n['mobile.must.select']
                    })
                }
                renderDom = <div key={index} className={`${css['select-container']} ${css['item-container']}`}>
                    {
                        item.validateType && item.validateType.required && <span className={`${css['xing']} ${css['xing-select']}`}>*</span>    
                    }
                    <select
                        id={item.key}
                        style={item.validateType && item.validateType.required && {left: '3%', width: '97%'}}
                        disabled={item.readonly}
                        value={formData[item.key] || ''}
                        onChange={change}>
                        {
                            <option value='' disabled>{item.placeHolder || item.label}</option>
                        }
                        {
                            item.optionList && item.optionList.length && item.optionList.map((item, i) => {
                                return <option key={i} value={item.value}>{item.label}</option>
                            })
                        }
                    </select>
                    <img src={iconDown} />
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'data': { 
                const change = (e) => { 
                    updateFormData({
                        ...formData,
                        [e.target.id]: moment(e.target.value).format('YYYY-MM-DD HH:mm:ss')
                    })
                    updateErrText({
                        ...errText,
                        [e.target.id]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                    })
                }
                renderDom = <div key={index} className={`${css['item-container']} ${css['date-container']}`}>
                    <span className={css['data-span']}>{item.label}</span>    
                    <input
                        id={item.key}    
                        type='datetime-local'
                        placeholder={item.placeHolder || item.label}
                        onChange={change} />
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'datestring': {
                const change = (e) => {
                    updateFormData({
                        ...formData,
                        [e.target.id]: moment(e.target.value).format('YYYY-MM-DD')
                    })
                    updateErrText({
                        ...errText,
                        [e.target.id]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                    })
                }
                renderDom = <div key={index} className={`${css['item-container']} ${css['date-container']}`}>
                    <span className={css['data-span']}>{item.label}</span>        
                    <input
                        id={item.key}    
                        type='date'
                        onChange={change}
                        placeholder={item.placeHolder || item.label} />
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'phone': {
                const changePrefix = (e) => { 
                    updateFormData({
                        ...formData,
                        [e.target.id]: {
                            countryCode: e.target.value,
                            phone: formData[e.target.id]&&formData[e.target.id]['phone'] || '',
                            phoneStr: `${e.target.value} ${formData[e.target.id]&&formData[e.target.id]['phone'] || ''}`
                        }
                    })
                }
                const changePhone = (e) => { 
                    let prefix = formData[e.target.id] && formData[e.target.id]['countryCode'] || `+${languageCode[getType()]}`
                    updateFormData({
                        ...formData,
                        [e.target.id]: {
                            ...formData[e.target.id],
                            countryCode: prefix,
                            phone: e.target.value,
                            phoneStr: `${prefix} ${e.target.value}`
                        }
                    })
                    if (e.target.value) {
                        if (!isPhone(e.target.value)) {
                            updateErrText({
                                ...errText,
                                [e.target.id]: i18n['forgetpwd.errormsg.mobile.invalid']
                            })
                        } else { 
                            updateErrText({
                                ...errText,
                                [e.target.id]: ''
                            })
                        }
                    } else { 
                        updateErrText({
                            ...errText,
                            [e.target.id]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                        })
                    }
                }
                renderDom = <div key={index} className={`${css['phone-container']} ${css['item-container']}`}>
                    <div className={css['phone-prefix']}>
                        <select
                            id={item.key}
                            disabled={item.readonly}
                            onChange={changePrefix}
                            value={formData[item.key]&&formData[item.key]['countryCode'] || `+${languageCode[getType()]}`}>
                            {
                                countryPhone && countryPhone.length ? countryPhone.map((item, i) => {
                                    return <option key={i} value={`+${item.value}`}>{`+${item.value}`}</option>
                                }) : <option value='+86'>+86</option>
                            }
                        </select>
                        <img src={iconDown} />
                    </div>
                    <div className={css['phone-field']}>
                        <TextField
                            id={item.key}    
                            type='tel'
                            disabled={item.readonly}
                            errorText={errText[item.key]}
                            errorStyle={TextFieldStyle.errorStyle}
                            onChange={changePhone}
                            value={formData[item.key]&&formData[item.key]['phone'] || ''}
                            style={TextFieldStyle.style}
                            hintStyle={TextFieldStyle.hintStyle}
                            underlineDisabledStyle={TextFieldStyle.underlineDisabledStyle}
                            floatingLabelStyle={TextFieldStyle.floatingLabelStyle}
                            floatingLabelShrinkStyle={TextFieldStyle.floatingLabelShrinkStyle}
                            inputStyle={TextFieldStyle.inputStyle}
                            underlineStyle={TextFieldStyle.underlineStyle}
                            floatingLabelText={item.label}
                            hintText={item.placeHolder}/>
                    </div>
                </div>
                break
            }
            case 'country': {
                const change = (e) => { 
                    updateFormData({
                        ...formData,
                        [e.target.id]: e.target.value
                    })
                    updateErrText({
                        ...errText,
                        [e.target.id]: e.target.value ? '' : i18n['mobile.must.select']
                    })
                }
                renderDom = <div key={index} className={`${css['select-container']} ${css['item-container']}`}>
                    <select
                        id={item.key}
                        onChange={change}
                        disabled={item.readonly}
                        value={formData[item.key] || ''}>
                        {
                            <option value='' disabled>{item.placeHolder || item.label}</option>
                        }
                        {
                            nationInfo && nationInfo.length && nationInfo.map((item, i) => {
                                return <option key={i} value={item.value}>{item.value}</option>
                            })
                        }
                    </select>
                    <img src={iconDown} />
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'city': {
                renderDom = <div key={index}>
                    <p className={css['city-label']}>
                        {
                            item.validateType && item.validateType.required && <span className={css['xing']}>*</span>
                        }  
                        {item.label}
                    </p>
                    <div className={`${css['city-container']} ${css['item-container']}`}>
                        <RenderCity
                            countryCache={countryCache}
                            item={item}/>
                    </div>
                </div>
                break
            }
            case 'checkbox': {
                let tempArr = formData[item.key] || []
                const change = (e, bool) => { 
                    let val = e.target.value
                    if (bool) {
                        tempArr.push(val)
                    } else { 
                        tempArr.splice(tempArr.indexOf(val), 1)
                    }
                    updateFormData({
                        ...formData,
                        [item.key]: tempArr.sort()
                    })
                    updateErrText({
                        ...errText,
                        [item.key]: !tempArr.length && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                    })
                }
                renderDom = <div key={index} className={css['checkbox-container']}>
                    <p className={css['checkbox-label']}>
                        {
                            item.validateType && item.validateType.required && <span className={css['xing']}>*</span>
                        }      
                        {item.label}
                    </p>
                    {
                        item.optionList && item.optionList.length && item.optionList.map((ite, i) => {
                            return <Checkbox
                                key={i}
                                disabled={item.readonly}
                                defaultChecked={formData[item.key] && formData[item.key].length && formData[item.key].indexOf(ite.value)!==-1}
                                value={ite.value}
                                onCheck={change}
                                label={ite.label}
                                style={CheckBoxStyle.style}
                                labelStyle={CheckBoxStyle.labelStyle}
                                iconStyle={CheckBoxStyle.iconStyle}/>
                        })
                    }
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'radio': {
                const change = (e) => {
                    updateFormData({
                        ...formData,
                        [item.key]: e.target.value
                    })
                    updateErrText({
                        ...errText,
                        [item.key]: !e.target.value && item.validateType && item.validateType.required ? i18n['mobile.must.write'] : ''
                    })
                }
                renderDom = <div key={index} className={css['checkbox-container']}>
                    <p className={css['checkbox-label']}>
                        {
                            item.validateType && item.validateType.required && <span className={css['xing']}>*</span>
                        }
                        {item.label}
                    </p>
                    <RadioButtonGroup
                        name={item.label}
                        disabled={item.readonly}
                        defaultSelected={formData[item.key] || ''}
                        onChange={change}>
                        {
                            item.optionList && item.optionList.length && item.optionList.map((ite, i) => {
                                return <RadioButton key={i}
                                    label={ite.label}
                                    value={ite.value}
                                    style={CheckBoxStyle.style}
                                    labelStyle={CheckBoxStyle.labelStyle}
                                    iconStyle={CheckBoxStyle.iconStyle}/>
                            })
                        }
                    </RadioButtonGroup>
                    {
                        errText[item.key] && <div className={css['line']}>{errText[item.key]}</div>
                    }
                </div>
                break
            }
            case 'image': { 
                renderDom = <div key={index} className={css['img-container']}>
                    <p className={css['img-label']}>
                        {
                            item.validateType && item.validateType.required && <span className={css['xing']}>*</span>
                        }    
                        {item.label}
                    </p>
                    <RenderImg item={item} {...this.props} />
                </div>
            }
        }
        return renderDom
    }

    render() {
        const { fieldList } = this.props
        return (
            <div className={css['field-container']}>
                {
                    this.renderFileds(fieldList)
                }
            </div>
        )
    }
}

export default connect(
    ({ common, openAcctStepPage, formData }) => ({
        countryInfo: common.countryInfo,
        countryPhone: common.countryPhone,
        nationInfo: common.nationInfo,
        formData: formData,
        errText: openAcctStepPage.errText
    }), ({ ...actions, ...commonActions })
)(RenderFields)