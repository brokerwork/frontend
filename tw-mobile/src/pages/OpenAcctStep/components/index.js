import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'

import * as actions from '../actions'
import * as commonActions from 'common/commonActions'

import { FullPageAvatarPaper } from 'widgets/FullPageAvatarPaper'
import { DisclaimerCard } from 'pages/Accounts/components/DisclaimerCard'
import { Agreements } from 'widgets/Agreements'
import RenderFields from './renderFields'
import { pxToRem } from 'utils/styleUtils'
import { isPhone, isEmail } from 'utils/validator'
import i18n from 'utils/i18n'
import css from './index.less'

let stepLabelStyle = {
    fontSize: '12px',
}

let iconContainerStyle = {
    paddingRight: pxToRem(5)
}

let buttonStyle = {
    transition: 'none'
}

let submitStyle = {
    width: '45%',
}

let prevBtnStyle = {
    marginRight: '10%',
    width: '45%', 
}

let countryCache = {}
let flattenedItems = {}
class OpenAcctStep extends Component {
    constructor() { 
        super()
        this.state = {
            stepIndex: 0,
            buttonText: i18n['openaccount.next'],
            buttonPrev: i18n['realaccount.prev'],
            checked: false,
            isShowDisclaimer: false,
            disclaimer: null
        }
    }

    componentDidMount() {
        const {
            routeParams,
            getInfoFields,
            getCountryPhone,
            getCountryInfo,
            getNationInfo,
            updateFormData,
            getApplyList,
            getOriginInfo,
            getPlatformList,
            getStructuralList,
        } = this.props
        
        getCountryPhone()
        getCountryInfo()
        getNationInfo()

        if (!JSON.parse(window.localStorage.getItem('LIST'))) { 
            getStructuralList().then((res) => {
                if (res && res.payload && res.payload.result){
                    window.localStorage.setItem('LIST', JSON.stringify(res.payload.data))
                }
            })
        }
    
        getPlatformList(routeParams.vendor).then((res) => { 
            if (res && res.payload && res.payload.result) {
                if (res.payload.data.featureStatus) {
                    if (res.payload.data.featureStatus.ApplyAccountWithSavedInfo === 'Enabled' || res.payload.data.featureStatus.ApplyAccountWithSavedInfoInProgressing === 'Enabled') {
                        //  同名开户
                        getOriginInfo(routeParams.vendor, res.payload.data.featureStatus).then(() => {
                            getInfoFields(routeParams.vendor)
                        })
                    } else { 
                        //  真实开户
                        getApplyList(routeParams.vendor, res.payload.data.featureStatus).then(() => { 
                            getInfoFields(routeParams.vendor)
                        })
                    }
                }
            }
        })
    }

    //  下一步
    next = () => { 
        const {
            errText,
            formData,
            fieldsInfo,
            updateErrText,
            updateFirstInfo,
            updateSecondInfo,
            routeParams,
            submitStep,
            isSame,
            updateSameStep1,
            updateSameStep2,
        } = this.props
        const { stepIndex } = this.state
        let validateResult = {}
        let firstInfo = []
        let secondInfo = []
        if (stepIndex == 0) {
            validateResult = this.validate(fieldsInfo.firstStepFieldList, formData)
            firstInfo = this.getListInfo(fieldsInfo.firstStepFieldList)
            updateFirstInfo(firstInfo)
        } else if (stepIndex == 1){ 
            validateResult = this.validate(fieldsInfo.secondStepFieldList, formData)
            secondInfo = this.getListInfo(fieldsInfo.secondStepFieldList)
            updateSecondInfo(secondInfo)
        }
        updateErrText(validateResult.errTextObj)
        if (validateResult.flag) return false

        //  分步提交数据
        if (stepIndex == 0) {
            let data = {}
            firstInfo.forEach((item) => { 
                data[item.key] = item.value
            })
            submitStep(routeParams.vendor, 'step1', data).then((res) => { 
                if (res && res.payload && res.payload.result) {
                    updateSameStep1(data)
                    this.setState({
                        stepIndex: stepIndex + 1
                    })
                }
            })
        } else if (stepIndex == 1){ 
            let data = {}
            secondInfo.forEach((item) => { 
                data[item.key] = item.value
            })
            submitStep(routeParams.vendor, 'step2', data).then((res) => { 
                if (res && res.payload && res.payload.result) {
                    updateSameStep2(data)
                    this.setState({
                        stepIndex: stepIndex + 1
                    })
                }
            })
        }
    }

    //  上一步
    prev = () => { 
        const { errText, formData } = this.props
        const { stepIndex } = this.state

        this.setState({
            stepIndex: stepIndex - 1
        })
    }

    getListInfo = (listInfo) => { 
        const { formData, countryInfo } = this.props
        let temp = []
        listInfo.forEach((item) => {
            if (formData[item.key]) {
                let tempVal = ''
                if (item.fieldType == 'text' || item.fieldType == 'textarea' || item.fieldType == 'country' || item.fieldType == 'date' || item.fieldType == 'datestring'){ 
                    tempVal = formData[item.key]
                }
                if (item.fieldType == 'phone'){ 
                    tempVal = formData[item.key]['phoneStr']
                }
                if (item.fieldType == 'select' || item.fieldType == 'radio'){ 
                    item.optionList.forEach((items) => { 
                        if (items.value == formData[item.key]){ 
                            tempVal = items.label
                        }
                    })
                }
                if (item.fieldType == 'checkbox'){ 
                    item.optionList.forEach((i) => { 
                        formData[item.key].forEach((j) => { 
                            if (i.value == j){ 
                                tempVal = tempVal + ' ' + i.label
                            }
                        })
                    })
                }
                if (item.fieldType == 'city') {
                    let country = ''
                    let province = ''
                    let city = ''
                    countryInfo.forEach((iCou) => {
                        if (iCou.id == formData[item.key]['country']){ 
                            country = iCou.value
                        }
                        if (iCou.id == formData[item.key]['province']){ 
                            province = iCou.value
                        }
                        if (iCou.id == formData[item.key]['city']){ 
                            city = iCou.value
                        }
                    })
                    tempVal = country + ' ' + province + ' ' + city
                }
                if (item.fieldType == 'image'){ 
                    tempVal = formData[item.key]
                }
                temp.push({
                    key: item.key,
                    label: item.label,
                    fieldType: item.fieldType,
                    value: formData[item.key],
                    tempVal: tempVal
                })
            }
        })
        return temp
    }

    //  提交
    submit = () => { 
        const {
            formData,
            fieldsInfo,
            updateErrText,
            openAcctSub,
            routeParams,
            updateThirdInfo,
            submitStep,
            isSame,
            applySameInfo,
            sameInfo,
            updateSameStep3,
        } = this.props
        const { stepIndex } = this.state
        let validateResult = {}
        let thirdInfo = []
        if (stepIndex == 2) {
            validateResult = this.validate(fieldsInfo.thirdStepFieldList, formData)
            thirdInfo = this.getListInfo(fieldsInfo.thirdStepFieldList)
            updateThirdInfo(thirdInfo)
        }
        updateErrText(validateResult.errTextObj)
        if (validateResult.flag) return false
        let data = {}
        thirdInfo.forEach((item) => { 
            data[item.key] = item.value
        })
        if (isSame) {
            updateSameStep3(data)
            this.props.router.push({ pathname: `/accounts/openAcctList/${routeParams.vendor}/2`, search: this.props.location.search })
        } else { 
            submitStep(routeParams.vendor, 'step3', data).then((res) => { 
                if (res && res.payload && res.payload.result) { 
                    this.props.router.push({ pathname: `/accounts/openAcctList/${routeParams.vendor}/1`, search: this.props.location.search })
                }
            })
        }
    }

    //  表单验证
    validate = (formList, formData) => { 
        var flag = false
        let errTextObj = {}
        formList.forEach((item) => { 
            if (item.validateType && item.validateType.required) {
                if (!formData[item.key]) {
                    flag = true
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: [item.fieldType] == 'select' ? i18n['mobile.must.select'] : i18n['mobile.must.write']
                    }
                } else if (item.fieldType == 'phone' && !isPhone(formData[item.key]['phone'])) {
                    flag = true
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: i18n['forgetpwd.errormsg.mobile.invalid']
                    }
                } else if (item.key == 'email' && !isEmail(formData[item.key])) {
                    flag = true
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: i18n['forgetpwd.errormsg.email.invalid']
                    }
                } else { 
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: ''
                    }
                }
            } else {
                if (item.fieldType == 'phone' && formData[item.key] && formData[item.key]['phone'] && !isPhone(formData[item.key]['phone'])) {
                    flag = true
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: i18n['forgetpwd.errormsg.mobile.invalid']
                    }
                } else if (item.key == 'email' && formData[item.key] && !isEmail(formData[item.key])) {
                    flag = true
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: i18n['forgetpwd.errormsg.email.invalid']
                    }
                } else { 
                    errTextObj = {
                        ...errTextObj,
                        [item.key]: ''
                    }
                }
            }
        })
        return {
            flag: flag,
            errTextObj: errTextObj
        }
    }

    //  根据字段渲染表单
    renderFields = (fieldList, flag, step) => {
        const { countryPhone, countryInfo, nationInfo, isSame, sameInfo, stepInfo } = this.props
        countryInfo.forEach((item) => { 
            countryCache[item.pid] = []
        })
        countryInfo.forEach((item) => {
            countryCache[item.pid].push({
                label: item.value,
                value: item.id
            })
            flattenedItems[item.id] = item.value
        })
        return (
            <RenderFields
                fieldList={fieldList}
                isSame={isSame}
                sameInfo={sameInfo ? sameInfo[flag] : {}}
                stepInfo={stepInfo ? stepInfo[`step${step}`] : {}}
                countryCache={countryCache}/>
        )
    }

    onAgreementCheck = () => {
		this.props.toggleAgreementCheckedFlag()
    }
    
    _loadDisclaimer = () => {
		let { fetchDisclaimer, routeParams } = this.props;
		let vendor = routeParams.vendor
		fetchDisclaimer(vendor).then(res => {
			this.setState({ disclaimer: res.data, isShowDisclaimer: true });
		})
    }
    //  切换服务器
    turnServer = (event) => { 
        this.props.router.push(`/accounts/openAcct/${event.target.value}`)
        window.location.reload()
    }

    render() {
        const { brand, fieldsInfo, countryPhone, countryInfo, routeParams, structuralList } = this.props
        let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
        let basicSettingMt4 = {}
        let basicSettingMt5 = {}
		structural_list && structural_list.length && structural_list.forEach((item) => { 
			if (item.structural == 'MT4') { 
				basicSettingMt4 = item.basicSetting
			}
			if (item.structural == 'MT5') { 
				basicSettingMt5 = item.basicSetting
			}
		})
        const { stepIndex, buttonText, buttonPrev } = this.state
        let nextBtnStyle = stepIndex == 0 ? { width: '100%', transition: 'none' } : { width: '45%', transition: 'none' }
        let cardActions = [
			<RaisedButton primary={true} style={{ width: '100%' }}
				buttonStyle={{ backgroundColor: 'rgb(0, 163, 254)', height: pxToRem(90) }}
                label={i18n['mobile.know.key']}
				onTouchTap={() => { this.setState({ isShowDisclaimer: false }) }} />
		]
        return (
            <FullPageAvatarPaper
                avatarSrc={brand.mobileLogo}
                headText={i18n['realaccount.info.confirm']}>
                <div className={css['step-container']}>
                    <div className={css['step-sever']}>
                        <span>{i18n['mobile.you.select']}</span>
                        <select
                            onChange={this.turnServer}    
                            defaultValue={routeParams.vendor}>
                            {
                                basicSettingMt4.enabled && <option value="MT4">【{basicSettingMt4.structuralName}】</option>
                            }
                            {
                                basicSettingMt5.enabled && window.location.href.indexOf('fromApp') == -1 && <option value="MT5">【{basicSettingMt5.structuralName}】</option>
                            }
                        </select>
                        <span>{i18n['mobile.use.server']}</span>
                    </div>    
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel
                                style={stepLabelStyle}
                                iconContainerStyle={iconContainerStyle}>
                                {i18n['mobile.realaccount.baseinfo']}
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel
                                style={stepLabelStyle}
                                iconContainerStyle={iconContainerStyle}>
                                {i18n['mobile.realaccount.investinfo']}
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel
                                style={stepLabelStyle}
                                iconContainerStyle={iconContainerStyle}>
                                {i18n['mobile.realaccount.identityinfo']}
                            </StepLabel>
                        </Step>
                    </Stepper>
                    <div className={css['content-wrap']}>
                        {
                            stepIndex == 0 && fieldsInfo.firstStepFieldList && <div className={css['content-step1']}>
                                {this.renderFields(fieldsInfo.firstStepFieldList, 'baseInfo', 1)}
                            </div>
                        }
                        {
                            stepIndex == 1 && fieldsInfo.secondStepFieldList && <div className={css['content-step1']}>
                                {this.renderFields(fieldsInfo.secondStepFieldList, 'financialInfo', 2)}
                            </div>
                        }
                        {
                            stepIndex == 2 && fieldsInfo.thirdStepFieldList && <div className={css['content-step1']}>
                                {this.renderFields(fieldsInfo.thirdStepFieldList, 'certificatesInfo', 3)}
                            </div>
                        }
                    </div>
                    {
                        stepIndex == 2 && <div style={{ marginTop: pxToRem(32) }} className={css["required"]}>
                            <Agreements
                                checked={this.props.agreementChecked}    
                                text={`${i18n['mobile.already']}{{ITEM}}${i18n['mobile.statement']}。`}
                                items={[{
                                    text: `《${i18n['openaccount.protocol2']}》`,
                                    onTouchTap: () => {
                                        //this.setState({isShowDisclaimer: true})
                                        this._loadDisclaimer();
                                    }
                                }]}
                                onCheck={this.onAgreementCheck}
                            />
                        </div>
                    }
                    {
                        fieldsInfo.firstStepFieldList && <div className={css['content-btn']}>
                            {
                                //  上一步
                                stepIndex > 0 && <RaisedButton
                                    style={prevBtnStyle}    
                                    label={buttonPrev}
                                    buttonStyle={buttonStyle}
                                    primary
                                    onClick={this.prev} />
                            }
                            {
                                //  下一步
                                stepIndex < 2 && <RaisedButton
                                    style={nextBtnStyle}    
                                    label={buttonText}
                                    buttonStyle={buttonStyle}
                                    primary
                                    onClick={this.next}/>
                            }
                            {
                                stepIndex == 2 &&<RaisedButton
                                    style={submitStyle}
                                    label={i18n['leverage.submit']}
                                    disabled={!this.props.agreementChecked}
                                    buttonStyle={buttonStyle}
                                    primary
                                    onClick={this.submit}/>
                            }
                        </div>
                    }
                    <DisclaimerCard
                        title={i18n['mobile.user.deal']}
						show={this.state.isShowDisclaimer}
						actions={cardActions}>
						<div dangerouslySetInnerHTML={{ __html: this.state.disclaimer }}></div>
					</DisclaimerCard>
                </div>
            </FullPageAvatarPaper>
        )
    }
}

export default connect(
    ({ common, openAcctStepPage, formData }) => ({
        brand: common.brand,
        countryInfo: common.countryInfo,
        countryPhone: common.countryPhone,
        nationInfo: common.nationInfo,
        fieldsInfo: openAcctStepPage.fieldsInfo,
        formData: formData,
        errText: openAcctStepPage.errText,
        isSame: openAcctStepPage.isSame,
        sameInfo: openAcctStepPage.sameInfo,
        agreementChecked: openAcctStepPage.agreementChecked,
        stepInfo: openAcctStepPage.stepInfo,
        structuralList: common.structuralList,
    }), ({ ...actions, ...commonActions })
)(OpenAcctStep)