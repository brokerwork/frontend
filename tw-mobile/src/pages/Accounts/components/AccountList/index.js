import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views'

import RaisedButton from 'material-ui/RaisedButton';
import cssLogin from 'pages/Login/components/login.less';
import { Tabs, Tab } from 'material-ui/Tabs';
import { pxToRem } from 'utils/styleUtils';
import { Header } from "widgets/Header";
import { AccountHeader } from '../AccountHeader/index';
import css from './index.less';
import { AccountGroup } from '../AccountGroup';
import { Storage } from 'utils/storage';
import { IScrollView } from 'widgets/IScrollView';
import PrivateUI from 'widgets/PrivateUI'
import i18n from 'utils/i18n'

let inkBarStyle = {
	height: pxToRem(7),
	marginTop: pxToRem(-7),
	backgroundColor: "#fff",
	boxShadow: "0 0 0.05rem rgba(0,0,0,0.2)"
}

let swipeStyle = {
	paddingTop: pxToRem(4),
	paddingBottom: pxToRem(125),
	backgroundColor: 'rgb(250, 250, 250)'
}

let bindBtnStyle = {
	borderRadius: pxToRem(8),
	border: '1px solid #00A3FE'
}

export class AccountList extends Component {
	constructor() { 
		super()
		this.state = {
			slideIndex: 0
		}
	}

	handleChange = (value) => {
		this.setState({
			slideIndex: value,
		})
	}

	static contextTypes = {
		router: React.PropTypes.object
	}

	_goToAccountSinglePage = (acct) => {
		this.context.router.push("/accounts/singlepage");
	}
	_openNewAccount = (isOpenMockAccount) => {
		if (isOpenMockAccount == true) {
			this.context.router.push('/accounts/open/mock')
		} else {
			const { openDialog } = this.props
			openDialog && openDialog(null)
			// fastOpenAble('MT4').then((res) => { 
			// 	if (res && res.payload && res.payload.data) {
			// 		this.context.router.push('/accounts/open/real')
			// 	} else {
			// 		return this.context.router.push('/accounts/openAcct/MT4')
			// 	}
			// })
		}
	}
	bindAcctFunc = () => { 
		this.context.router.push('/accounts/bindAccount/MT4')
	}
	_createNoAccountsPage = (tips, isOpenMockAccount, visible) => {
		//	isOpenMockAccount = false 真实账户里需要判断是否允许 开通账户 绑定账户
		return (
			<div className={css["taMobileAccountTips"]}>
				<div className={css['taMobileNoRealAccount']}>
				</div>
				<p className={css["tip"]}>{tips}</p>
				<div className={css["clickOpenAcct"]}>
					{
						visible && <RaisedButton
							label={i18n['overview.openaccount']}
							primary={true}
							className={css['openAcctBtn']}
							buttonStyle={{ borderRadius: pxToRem(8) }}
							style={{ boxShadow: 'none', borderRadius: pxToRem(8) }}
							onClick={this._openNewAccount.bind(this, isOpenMockAccount)} />
					}
					{
						!isOpenMockAccount && <RaisedButton
							label={i18n['mobile.bind.account']}
							labelColor='#00A3FE'
							buttonStyle={bindBtnStyle}
							className={css['bindAcctBtn']}
							style={{ boxShadow: 'none', borderRadius: pxToRem(8) }}
							onClick={this.bindAcctFunc}/>
					}
				</div>
				
			</div>
		);
	}

	_onTouchTap = (acct) => {
		window.localStorage.setItem('ACCOUNT_DATA_MOBILE_1', JSON.stringify(acct))
		let { updateDepositConfig, updateSelectedAccount, fetchAccountToken } = this.props
		if (acct.accountType.toLowerCase() !== 'live') {
			return false
		}
		updateSelectedAccount(acct)
		fetchAccountToken(acct).then((res) => {
			if (!res || !res.payload || !res.payload.result) return false
			let accountToken = res.payload.data
			Storage.putString(Storage.Keys.ACCOUNT_TOKEN, accountToken)
			this._goToAccountSinglePage()
		})
	}

	_renderRealAccounts = (visibleReal, structuralList) => {
		let { accounts, fastOpenAble, openDialog } = this.props;
		if (accounts === null) {
			return null;
		}
		let mt4PlatformLiveAccounts = accounts.filter(o => {
			return o.accountType == 'Live' && o.vendor === 'MT4';
		});
		let mt5PlatformLiveAccounts = accounts.filter(o => {
			return o.accountType == 'Live' && o.vendor === 'MT5';
		});
		if (mt4PlatformLiveAccounts.length == 0 && mt5PlatformLiveAccounts.length == 0) {
			return this._createNoAccountsPage(i18n['mobile.no.open.real.key'], false, visibleReal);
		}
		let groups = [mt4PlatformLiveAccounts, mt5PlatformLiveAccounts];
		return groups.map((data, index) => {
			return data.length > 0 ? <AccountGroup
				key={index}
				accounts={data}
				isLive={true}
				accountType={'live'}
				visible={visibleReal}
				openDialog={openDialog}
				fastOpenAble={fastOpenAble}
				structuralList={structuralList}
				onAccountTap={this._onTouchTap} /> : null
		});
	}
	_renderDemoAccounts = (visibleDemo, structuralList) => {
		let { accounts } = this.props;
		if (accounts === null) {
			return null;
		}
		let mt4PlatformDemoAccounts = accounts.filter(o => {
			return o.accountType == 'Demo' && o.vendor === 'MT4';
		});
		let mt5PlatformDemoAccounts = accounts.filter(o => {
			return o.accountType == 'Demo' && o.vendor === 'MT5';
		});
		if (mt4PlatformDemoAccounts.length == 0 && mt5PlatformDemoAccounts.length == 0) {
			return this._createNoAccountsPage(i18n['mobile.no.open.mock.key'], true, visibleDemo);
		}
		let groups = [mt4PlatformDemoAccounts, mt5PlatformDemoAccounts];
		return groups.map((data, index) => {
			return data.length > 0 ? <AccountGroup 
				key={index}
				accountType={'demo'}
				visible={visibleDemo}
				structuralList={structuralList}
				accounts={data} 
				isLive={false} /> : null
		});
	}

	render() {
		let visibleReal = false
		let visibleDemo = false
		let { structuralList, accounts } = this.props
		if (structuralList && structuralList.length) {
			structuralList.forEach((item) => {
				if (item.basicSetting.allowRealAccount) {
					visibleReal = true
				}
				if (item.basicSetting.allowDemoAccount){ 
					visibleDemo = true					
				}
			})
		}
		let actMock = accounts.filter((o) => { 
			return o.accountType == 'Demo'
		})
		return (
			<div className={css['taMobileAccount']}>
				<Header>
					<AccountHeader />
				</Header>
				<Tabs className={css['tabs']}
					inkBarStyle={inkBarStyle}
					onChange={this.handleChange}
					value={this.state.slideIndex}>
					<Tab label={i18n['mobile.real.account.key']}
						className={css['tab']}
						style={{float:"left"}}
						value={0}>
					</Tab>
					{
						visibleDemo || actMock.length ? <Tab label={i18n['mobile.mock.account.key']}
							className={css['tab']}
							style={{float:"right"}}
							value={1}>
						</Tab> : null
					}
				</Tabs>
				<SwipeableViews 
					style={swipeStyle}	
					animateHeight={true}
					index={this.state.slideIndex}
					onChangeIndex={this.handleChange}>
					<div>
						{this._renderRealAccounts(visibleReal, structuralList)}
					</div>
					{
						visibleDemo || actMock.length > 0 ? <div>
							{this._renderDemoAccounts(visibleDemo, structuralList)}
						</div> : <div></div>
					}
				</SwipeableViews>
			</div>
		)
	}
}