import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';

import * as actions from '../../actions'
import * as commonActions from 'common/commonActions'
import { FullPagePaperComponent } from 'widgets/FullPagePaperComponent'
import { pxToRem } from 'utils/styleUtils'
import css from './index.less'
import i18n from 'utils/i18n'

import icon_dropdown from 'images/icon_dropdown.png'
import icon_dropdown2 from 'images/icon_dropdown2.png'

const fullPagePaperStyle = {
	background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

const paperStyle = {
	padding: 0
}

const textStyle = {
	width: "100%",
	height: pxToRem(100)
}

const underlineStyle = {
	bottom: 0
}

const buttonStyle = {
	backgroundColor: "#00A3FE",
	height: pxToRem(88),
	width: pxToRem(630),
	lineHeight: pxToRem(88),
	fontSize: 20
}

const overlayStyle = {
	height: pxToRem(88),
	transition: 'none'
}

const style = {
	borderRadius: pxToRem(8),
	transition: 'none',
	boxShadow: "0 0 0.2rem rgba(0,0,0,0.4)"
}

class SubmitFields extends Component {
    constructor() { 
        super()
        this.state = {
            first: true,
            second: false,
            third: false,
            title: '',
            description: '',
            isSubmit: false
        }
    }

    componentDidMount() { 
        
    }

    renderFormItem = (infoList) => { 
        return infoList && infoList.length ? infoList.map((item, index) => { 
            return (
                item.fieldType == 'image' ? <div className={css['info-li']} key={index}>
                    <p className={css['info-img-label']}>{item.label}</p>
                    <div>
                        <img style={{width: '50%'}} src={item.tempVal.indexOf('http') == 0 || item.tempVal.indexOf('//') == 0 ? item.tempVal : `/api${item.tempVal}`} />
                    </div>
                </div> : <div className={css['info-li']} key={index}>
                    <span className={css['info-left']}>{item.label}</span>
                    <span className={css['info-text-right']}>{item.tempVal}</span>
                </div>
            )
        }) : null
    }

    closeInfo = (dom) => { 
        this.setState({
            [dom]: !this.state[dom]
        })
    }

    openAcctSub = () => { 
        const { formData,
            openAcctSub, 
            routeParams, 
            applySameInfo, 
            sameInfo, 
            isSame,
            sameStep1,
            sameStep2,
            sameStep3,
        } = this.props
        if (isSame) {
            applySameInfo(routeParams.vendor, {
                step1: sameStep1,
                step2: sameStep2,
                step3: sameStep3,
            }).then((res) => { 
                if (res && res.payload && res.payload.result) { 
                    if (window.location.href.indexOf('fromApp') != -1) {
                        window.postMessage(JSON.stringify({ result: true }), '*')
                    } else { 
                        this.setState({
                            title: i18n['mobile.same.apply.success'],
                            description: i18n['mobile.same.apply.info'],
                            isSubmit: true
                        })
                    }
                }
            })
        } else { 
            openAcctSub(routeParams.vendor).then((res) => { 
                if (res && res.payload && res.payload.result) { 
                    if (window.location.href.indexOf('fromApp') != -1) {
                        window.postMessage(JSON.stringify({ result: true }), '*')
                    } else { 
                        this.setState({
                            title: i18n['mobile.account.apply.success'],
                            description: i18n['mobile.account.apply.info'],
                            isSubmit: true
                        })
                    }
                }
            })
        }
    }

    backAccounts = () => { 
        this.props.router.replace('/accounts')
    }

    render() {
        const { firstInfo, secondInfo, thirdInfo, routeParams } = this.props

        return (
            <FullPagePaperComponent
				style={fullPagePaperStyle}
				paperStyle={paperStyle}
			>
                <div className={`mock-acct-success ${css["mock-acct-success"]}`}>
                    <div className={css["content"]}>
                        {
                            this.state.isSubmit ? <div className={css["top"]}>
                                <p>{this.state.title}</p>
                                <p className={css["description"]}>{this.state.description}</p>
                                <p className={'iconfont icon-TW_mobile_kaihuchenggong'}></p>
                            </div> : null
                        }
                        <div className={css["center"]}>
                            <div className={css['center-item']}>
                                <div onClick={this.closeInfo.bind(this, 'first')}>
                                    {
                                        this.state.first ? <img src={icon_dropdown} style={{ width: pxToRem(18) }} />
                                            : <img src={icon_dropdown2} style={{ width: pxToRem(13) }} />
                                    }    
                                    <span className={css['center-tit']}>{i18n['mobile.realaccount.baseinfo']}</span>
                                </div>
                                {
                                    this.state.first ? <div style={{paddingLeft: pxToRem(35)}}>
                                        {this.renderFormItem(firstInfo)}
                                    </div> : null
                                }
                            </div>
                            <div className={`${css['center-item']} ${css['center-item-line']}`}>
                                <div onClick={this.closeInfo.bind(this, 'second')}>
                                    {
                                        this.state.second ? <img src={icon_dropdown} style={{ width: pxToRem(18) }} />
                                            : <img src={icon_dropdown2} style={{ width: pxToRem(13) }} />
                                    }
                                    <span className={css['center-tit']}>{i18n['mobile.realaccount.investinfo']}</span>
                                </div>
                                {
                                    this.state.second ? <div style={{paddingLeft: pxToRem(35)}}>
                                        {this.renderFormItem(secondInfo)}
                                    </div> : null
                                }
                            </div>
                            <div className={css['center-item']}>
                                <div onClick={this.closeInfo.bind(this, 'third')}>
                                    {
                                        this.state.third ? <img src={icon_dropdown} style={{ width: pxToRem(18) }} />
                                            : <img src={icon_dropdown2} style={{ width: pxToRem(13) }} />
                                    }
                                    <span className={css['center-tit']}>{i18n['mobile.realaccount.identityinfo']}</span>
                                </div>
                                {
                                    this.state.third ? <div style={{paddingLeft: pxToRem(35)}}>
                                        {this.renderFormItem(thirdInfo)}
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className={css["bottom"]}>
                            {
                                this.state.isSubmit ? <RaisedButton
                                    label={i18n['mobile.back.account']}
                                    primary={true}
                                    className={css["login-btn"]}
                                    buttonStyle={buttonStyle}
                                    overlayStyle={overlayStyle}
                                    style={style}
                                    onClick={this.backAccounts} /> : <RaisedButton
                                        label={i18n['mobile.confirm.open']}
                                        primary={true}
                                        className={css["login-btn"]}
                                        buttonStyle={buttonStyle}
                                        overlayStyle={overlayStyle}
                                        style={style}
                                        onClick={this.openAcctSub} /> 
                            }
                        </div>
                    </div>
                </div>
			</FullPagePaperComponent>
        )
    }
}

export default connect(
    ({ common, openAcctStepPage, formData }) => ({
        formData: formData,
        firstInfo: openAcctStepPage.firstInfo,
        secondInfo: openAcctStepPage.secondInfo,
        thirdInfo: openAcctStepPage.thirdInfo,
        isSame: openAcctStepPage.isSame,
        sameInfo: openAcctStepPage.sameInfo,
        sameStep1: openAcctStepPage.sameStep1,
        sameStep2: openAcctStepPage.sameStep2,
        sameStep3: openAcctStepPage.sameStep3,
    }), ({ ...actions, ...commonActions })
)(SubmitFields)