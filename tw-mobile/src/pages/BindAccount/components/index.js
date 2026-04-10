// libs
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as commonActions from 'common/commonActions';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
// widgets
import { FullPageAvatarPaper } from 'widgets/FullPageAvatarPaper';
import { FullPagePaperComponent } from 'widgets/FullPagePaperComponent'
import { OpenAcctSuccess } from '../../OpenMockAcctSuccess/components/openAcctSuccess'
import { IconTextField } from 'widgets/IconTextField';
import { IconSelectField } from 'widgets/IconSelectField';
import { Agreements } from 'widgets/Agreements';
import { FormConfirmation } from 'widgets/FormConfirmation';
import AgreePopup from 'widgets/AgreePopup'
import i18n from 'utils/i18n'

// utils
import { pxToRem } from 'utils/styleUtils';
// images
import iconServerDataURI from 'images/icon_server@3x.png';
import iconNameDataURI from 'images/icon_name@3x.png';
import iconNumberDataURI from 'images/icon_account_number@3x.png'
import iconPswdDataURI from 'images/icon_password@3x.png'
import iconEditDataURI from 'images/icon_edit@3x.png'
import downIcon from 'images/icon_phoneDown.png';

//  style
import css from "./index.less";
/* ----------------------- main --------------------------- */

let formHeight = pxToRem(98)
let description = i18n['mobile.info.send.email']

let style = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
}

let fullPagePaperStyle = {
	background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

const paperStyle = {
	padding: 0
}
class BindAccount extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
            selectedServer: '',
            serverId: '',
            accountNumber: '',
            accountPswd: '',
            accountBz: '',
            checked: false,
            isShowDisclaimer: false,    //  用户协议
            disclaimer: '',             //  用户协议内容
            confirm: false,             //  确认弹框
            isBind: false,              //  是否点击绑定按钮
            isBindSuc: false            //  是否绑定成功
		}
    }

    componentDidMount() { 
        const { getServerList, routeParams } = this.props
        getServerList(routeParams.vendor)
    }

    renderServerNames = () => {
        let { serverList } = this.props
		return serverList && serverList.map(o => {
			return (
				<MenuItem
					key={o.serverId}
					value={o.serverId}
					primaryText={o.serverName}/>
			)
		})
    }

    selectServer = (event) => {
        let el = event.target
        this.setState({
            selectedServer: el.options[el.selectedIndex].text,
            serverId: el.value
        })
    }

    accountChange = (field, event) => {
        const { routeParams, msgDialog } = this.props
        let val = event.target.value
        if (routeParams.vendor == 'cTrader' && field == 'accountPswd' && val.length > 128) {
            msgDialog(i18n['mobile.bind.pswd.long'])
            val = val.substring(0, 128)
        }
        this.setState({
            [field]: val
        })
    }

    //  已阅读checkbox
    readCheck = () => { 
        this.setState({
            checked: !this.state.checked
        })
    }

    //  加载用户协议
    loadDisclaimer = () => {
        const { commonDisclaimer, msgDialog, routeParams } = this.props
        commonDisclaimer(routeParams.vendor).then(res => {
            if (res.payload.result){ 
                this.setState({
                    disclaimer: res.payload.data,
                    isShowDisclaimer: true
                })
            }
		})
    }

    //  关闭用户协议
    closePopup = () => { 
        this.setState({
            isShowDisclaimer: false
        })
    }

    //  绑定按钮
    onBind = () => {
        this.setState({
            isBind: true
        })
        if (!this.state.selectedServer || !this.state.accountNumber || !this.state.accountPswd){ 
            return false
        }
        this.setState({
            confirm: true
        })
    }

    //  确认窗口
    createConfirm = () => { 
        return [
			{
				name: i18n['bindaccount.server'],
				value: this.state.selectedServer
			}, {
				name: i18n['overview.account.active.confirm.account'],
				value: this.state.accountNumber
			}, {
				name: i18n['general.comment.tw'],
				value: this.state.accountBz
			}
		]
    }
    //  关闭确认窗口
    closeConfirm = () => { 
        this.setState({
            confirm: false
        })
    }

    //  返回总览页
    openAccountsURL = () => {
		this.props.router.push("/accounts")
    }

    //  提交绑定
    submitConfirm = () => { 
        const { bindCheck, routeParams } = this.props
        const {
            selectedServer,
            serverId,
            accountNumber,
            accountPswd,
            accountBz
         } = this.state
        bindCheck({
            accountId: accountNumber,
            comment: accountBz,
            password: accountPswd,
            serverId: serverId,
            vendor: routeParams.vendor
        }).then((res) => {
            if (res && res.payload && res.payload.result) {
                if (window.location.href.indexOf('fromApp') != -1) {
                    window.postMessage(JSON.stringify({ result: true }), '*')
                } else { 
                    this.setState({
                        isBindSuc: true
                    })
                }
            } else { 
                if (window.location.href.indexOf('fromApp') != -1) {
                    window.postMessage(JSON.stringify({ result: false }), '*')
                }
            }
        }).catch((err) => { 
            if (window.location.href.indexOf('fromApp') != -1) {
				window.postMessage(JSON.stringify({ result: false }), '*')
			}
        })
    }
    
    //  绑定成功后生成的item
    getItems = () => {
        return [
            {
				src: iconServerDataURI,
				title: i18n['bindaccount.server'],
				content: this.state.selectedServer
            },
            {
				src: iconNumberDataURI,
				title: i18n['overview.account.active.confirm.account'],
				content: this.state.accountNumber
            }
        ]
    }
    render() { 
        const { serverList } = this.props
        const { isBind, serverId, accountNumber, accountPswd, accountBz } = this.state

        return (
            <div style={{ height: '100%' }}>
                {
                    this.state.isBindSuc ? <FullPagePaperComponent
                        style={fullPagePaperStyle}
                        paperStyle={paperStyle}>
                            <OpenAcctSuccess
                                title={i18n['mobile.bind.sub.suc']}
                                items={this.getItems()}
                                description={description}
                                onTouchTap={this.openAccountsURL} />
                    </FullPagePaperComponent> : <FullPageAvatarPaper
                            avatarSrc={this.props.brand.mobileLogo}
                            headText={i18n['mobile.check.send.email']}>
                            {
                                <div className={css['form-wrap']}>
                                    {/* <IconSelectField
                                        fullWidth
                                        hintText={i18n['mobile.server.required']}
                                        height={formHeight}
                                        iconSrc={iconServerDataURI}
                                        value={serverId}
                                        errorText={isBind && !serverId && i18n['mobile.must.select']}
                                        onChange={this.selectServer}>
                                        {this.renderServerNames()}
                                    </IconSelectField> */}
                                    <div className={css['vendor-server']}>
                                        <img src={iconServerDataURI} className={css['server-prefix']}/>
                                        <select
                                            style={serverId ? { color: 'rgba(0,0,0,0.87)' } : {color: 'rgba(0,0,0,0.3)'}}	
                                            value={serverId || ''}
                                            onChange={this.selectServer}>
                                            <option value='' disabled style={{display: 'none'}}>{i18n['mobile.server.required']}</option>
                                            {
                                                serverList && serverList.length && serverList.map((item, index) => { 
                                                    return <option key={index} value={item.serverId}>{item.serverName}</option>
                                                })
                                            }
                                        </select>
                                        <img src={downIcon} className={css['down-icon']}/>
                                    </div>
                                    <IconTextField
                                        fullWidth
                                        hintText={i18n['overview.account.active.confirm.account']}
                                        style={style}
                                        height={formHeight}
                                        iconSrc={iconNumberDataURI}
                                        value={accountNumber}
                                        errorText={isBind && !accountNumber && i18n['mobile.must.write']}
                                        onChange={this.accountChange.bind(this, 'accountNumber')} />
                                    <IconTextField
                                        fullWidth
                                        hintText={i18n['bindaccount.main.password']}
                                        style={style}
                                        type='password'
                                        height={formHeight}
                                        iconSrc={iconPswdDataURI}
                                        value={accountPswd}
                                        errorText={isBind && !accountPswd && i18n['mobile.must.write']}
                                        onChange={this.accountChange.bind(this, 'accountPswd')} />
                                    <IconTextField
                                        fullWidth
                                        hintText={i18n['general.comment.tw']}
                                        style={style}
                                        height={formHeight}
                                        iconSrc={iconEditDataURI}
                                        value={accountBz}
                                        onChange={this.accountChange.bind(this, 'accountBz')} />
                                    <div style={{ marginTop: pxToRem(32) }} className={css["required"]}>
                                        <Agreements
                                            checked={this.state.checked}
                                            text={`${i18n['mobile.already']}{{ITEM}}${i18n['mobile.statement']}`}
                                            items={[{
                                                text: `《${i18n['openaccount.protocol2']}》`,
                                                onTouchTap: () => {
                                                    this.loadDisclaimer()
                                                }
                                            }]}
                                            onCheck={this.readCheck}/>
                                    </div>
                                    <RaisedButton
                                        style={{marginTop: pxToRem(110)}}
                                        fullWidth
                                        buttonStyle={{ height: pxToRem(88)}}
                                        label={i18n['mobile.bind.btn']}
                                        primary
                                        disabled={!this.state.checked}
                                        onTouchTap={this.onBind}
                                    />
                                    <AgreePopup
                                        title={i18n['mobile.user.deal']}
                                        onClose={this.closePopup}
                                        show={this.state.isShowDisclaimer}>
                                        <div dangerouslySetInnerHTML={{ __html: this.state.disclaimer }}></div>
                                    </AgreePopup>
                                    <FormConfirmation
                                        title={i18n['mobile.bind.info']}
                                        show={this.state.confirm}
                                        formFields={this.createConfirm()}
                                        onCancel={this.closeConfirm}
                                        onOK={this.submitConfirm} />
                                </div>
                            }
                        </FullPageAvatarPaper>
                }
            </div>
        )
    }
}

export default connect(
	({ common, bindAccountPage }) => ({
        brand: common.brand,
        commonServerNames: common.commonServerNames,
        serverList: bindAccountPage.serverList
	}),
	({ ...actions, ...commonActions })
)(BindAccount)