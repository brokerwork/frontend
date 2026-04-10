/**
 *  在线入金页
 */

import React from 'react';

// component
import { Page, PageContent } from 'widgets/PageWrapper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { AccountHeader } from '../../AccountSinglePage/components/AccountHeader';
import { InputItem } from './InputItem';
import { SelectItem } from './SelectItem';
import { Select } from './Select';
import { DisclaimerCard } from 'pages/Accounts/components/DisclaimerCard';
import { FormConfirmation } from 'widgets/FormConfirmation';
import i18n from 'utils/i18n'

// css
import css from "./index.less";
import {
	buttonStyle,
	overlayStyle,
	style,
	labelStyle,
	underlineDisabledStyle,
	contentStyle
} from "./style";

//  utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import {
	hasMinDepositLimit,
	checkExchangeRateSettings,
	checkSelectedAccount,
	checkPayList,
	checkExchange,
	hasDepositSetting,
} from '../checkArguments';
import { Storage } from 'utils/storage';
import { post, get } from '../../../utils/api';
import { UserInfo, getCachedToken, getCachedUserInfo } from 'utils/userinfo';

let BigNumber = require('bignumber.js');
import icon_announcement from 'images/icon_announcement.png'

export class Deposit extends React.Component {

	constructor() {
		super();
		this.state = {
			show: false,
			showConfirm: false
		}
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		let { updateDepositSetting,
			updatePayCurrency,
			updateSelectedPaymethod,
			updateCurrentRateSetting,
			depositSetting,
			selectedAccount,
			updateDepositConfig,
			getDepositConfig
		} = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let func = getDepositConfig(selectedAccount.vendor)
		Promise.all([func]).then((res) => {
			let depositSetting = res[0].payload.data;
			updateDepositConfig(depositSetting);
			let payList = depositSetting.payList;
			if (!checkPayList(payList)) return;
			let currentPayMethod = payList[0];
			updateSelectedPaymethod(parseDepositSetting(payList)[0])
			updatePayCurrency(currentPayMethod.currency);
			let currentRateSetting = this.parseRateSetting(currentPayMethod.currency);
			updateCurrentRateSetting(currentRateSetting);
			this.init(currentRateSetting);
		})

		function parseDepositSetting(payList) {
			let payLists = payList.map(o => {
				return {
					"currency": o.currency,
					"value": o.providerId,
					"primaryText": o.name,
					"providerName": o.providerName
				}
			})
			return payLists
		}
	}

	resetErrorText = () => {
		let { setFieldErrorText } = this.props;
		setFieldErrorText('depositAmountValidateErrorText', null);
		setFieldErrorText('payAmountValidateErrorText', null);
		setFieldErrorText('payMethodValidateErrorText', null);
	}

	parseItems = (selectedAccount) => {

		if (!checkSelectedAccount(selectedAccount)) return;
		let { account, accountName, currency } = selectedAccount;
		return [
			{ "title": `${i18n['fundflow.column.common.accountId']}:`, "content": account },
			{ "title": `${i18n['mobile.account.name.key']}:`, "content": accountName },
			{ "title": `${i18n['deposit.currency']}:`, "content": currency }
		]
	}

	parseAmountHintText = () => {
		//  如果minDeposit、maxDeposit为null说明没有最高最低入金限制
		let { showCharge, minDeposit, maxDeposit, payList } = this.props.depositSetting;
		let selectedAccount = this.props.selectedAccount;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		if (!minDeposit && !maxDeposit) {
			return null
		}
		if (!checkSelectedAccount(selectedAccount)) return null;
		let result = '';
		if (minDeposit) {
			result += `${i18n['deposit.depositAmount.prompt.low']}${minDeposit} `
		}
		if (maxDeposit) {
			result += `${i18n['deposit.depositAmount.prompt.high']}${maxDeposit} `
		}
		result += `(${selectedAccount.currency})`
		return result;
	}

	createConfirmationFormFields = () => {
		let {
      		depositAmount,
			payAmount,
			comment,
			payCurrency
		} = this.props.depositPage;
		let { selectedAccount } = this.props
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let {
			account,
			accountName,
			currency,
			serverName
		} = selectedAccount;
		return [
			{
				name: i18n['tausermgmt.server'],
				value: serverName
			},
			{
				name: i18n['tradereport.account'],
				value: account
			},
			{
				name: i18n['mobile.account.name.key'],
				value: accountName
			},
			{
				name: i18n['fundflow.column.deposit.depositAmount'],
				value: `${depositAmount} ${currency}`
			},
			{
				name: i18n['deposit.paymentAmount'],
				value: `${payAmount} ${payCurrency}`
			},
			{
				name: i18n['fundflow.column.common.comment'],
				value: comment
			}
		];
	}

	onConfirmationCanel = () => {
		this.setState({
			showConfirm: false
		})
	}

	parseParams = () => {
		let { payCurrency, depositAmount, payAmount, comment, selectedPaymethod } = this.props.depositPage;
		let { selectedAccount } = this.props
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let { account, accountName, currency, vendor, serverName } = selectedAccount;
		let params = {
			"accountId": account,
			"accountName": accountName,
			"currency": currency,
			"vendor": vendor,
			"payCurrency": payCurrency,
			"depositAmount": depositAmount,
			"payAmount": payAmount,
			"serverId": serverName,
			"tenantId": window.GlobalVar.tenantId,
			"payPlatform": selectedPaymethod.value,
			"comment": comment
		}
		return params
	}

	onConfirmationOK = () => {
		this.setState({
			showConfirm: false
		})
		document.getElementById("depositForm").submit()
	}

	onSubmit = (e) => {
		setTimeout(() => {
			this.refs.myInput.focus()
		 }, 0)
		let validation = this.submitValidation();
		if (!validation) return;
		this.props.updateParams(this.parseParams());
		setTimeout(() => { 
			this.setState({
				showConfirm: true
			})
		}, 300)
	}

	submitValidation = () => {
		let result = true;
		let { depositPage, setFieldErrorText } = this.props;
		let {
      		depositAmountValidation,
			payAmount,
			selectedPaymethod,
			exchange
    	} = depositPage;
		if (!depositAmountValidation) {
			result = false;
			setFieldErrorText('depositAmountValidateErrorText', i18n['mobile.deposit.true.money.key']);
		}
		if (!selectedPaymethod) {
			result = false;
			setFieldErrorText('payMethodValidateErrorText', i18n['mobile.deposit.true.pay.key']);
		}
		if (!exchange) {
			result = false;
		}
		return result;
	}

	isAmountValid = (val) => {
		let reg = /^[0-9]+(\.?[0-9]+)?$/;
		let { minDeposit, maxDeposit } = this.props.depositSetting;
		if (!reg.test(val)) return false;
		let minResult = true;
		let maxResult = true;
		let amount = new BigNumber(val);
		if (minDeposit) {
			let min = new BigNumber(minDeposit);
			minResult = amount.greaterThanOrEqualTo(min);
		}
		if (maxDeposit) {
			let max = new BigNumber(maxDeposit);
			maxResult = amount.lessThanOrEqualTo(max);
		}
		return maxResult && minResult;
	}

	init = (currentSetting) => {
		let { updateExchange, updatePayAmount, depositPage, updatePayCurrency } = this.props;
		let { exchange, exchangeFloat, exchangeMode, payCurrency } = currentSetting;
		let { selectedAccount } = this.props
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let transactionCurrency = selectedAccount.currency;
		updatePayCurrency(payCurrency)
		//let float = new BigNumber(exchangeFloat);
		let depositAmount = depositPage.depositAmount;
		if (exchangeMode.toLowerCase() === "manual") {
			//let manualExchange = new BigNumber(exchange).times(float.plus(1));
			let manualExchange = exchange
			updateExchange(manualExchange.toFixed(4))
			let isAmountValid = this.isAmountValid(depositAmount);
			if (!isAmountValid) {
				return;
			}
			//let amount = new BigNumber(depositAmount);
			let manualPayAmount = (manualExchange.toFixed(4) * depositAmount).toFixed(2);
			updatePayAmount(manualPayAmount);
		} else {
			get(`/api/v1/ops/product/exchange/rate/${payCurrency}/${transactionCurrency}`, {
				headers: {
					'x-api-token': getCachedToken()
				}
			}).then(res => {
				//let autoMaticExchange = new BigNumber(res.data).times(float.plus(1));
				let autoMaticExchange = res.data * (1 + exchangeFloat / 100)
				updateExchange(autoMaticExchange.toFixed(4));
				let isAmountValid = this.isAmountValid(depositAmount);
				if (!isAmountValid) {
					return;
				}
				//let amount = new BigNumber(depositAmount);
				let autoMaticPayAmount = (autoMaticExchange.toFixed(4) * depositAmount).toFixed(2);
				updatePayAmount(autoMaticPayAmount);
			}).catch(err => {
				updatePayAmount('');
				updateExchange(null);
			})
		}
	}

	changePayMethod = (paymethodItem) => {
		//  如果支付方式下拉框为空，选不了一个选项，这个方法不会被触发
		let { updatePayMethod,
			setFieldErrorText,
			updateSelectedPaymethod,
			updateExchange,
			updatePayAmount,
			updateCurrentRateSetting,
			depositPage,
			selectedAccount
		} = this.props;
		let { depositAmountValidation, depositAmount } = depositPage;
		updateSelectedPaymethod(paymethodItem)
		setFieldErrorText('payMethodValidateErrorText', null);
		let currentSetting = this.parseRateSetting(paymethodItem.currency);
		updateCurrentRateSetting(currentSetting);
		this.init(currentSetting);
	}

	parseRateSetting = (payCurrency) => {
		let exchangeRateSettings = this.props.depositSetting.exchangeRateSettings;
		let { selectedAccount } = this.props
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let depositCurrency = selectedAccount.currency;
		if (payCurrency === depositCurrency){ 
			return {
				exchange: 1,
				exchangeFloat: 0,
				exchangeMode: "Manual", 
				payCurrency: payCurrency,
				showExchange: false,
				transactionCurrency: depositCurrency
			}
		}
		return exchangeRateSettings.filter(setting => {
			return setting.transactionCurrency === depositCurrency && setting.payCurrency === payCurrency
		})[0];
	}


	onDepositAmount = (amount) => {
		let {
			updateDepositAmount,
			setFieldErrorText,
			updatePayAmount,
			depositPage,
			updateDepositAmountValidation
		} = this.props;
		let { exchange, selectedPaymethod } = depositPage;
		updateDepositAmount(amount);
		let validation = this.isAmountValid(amount);
		updateDepositAmountValidation(validation);
		if (validation) {
			setFieldErrorText('depositAmountValidateErrorText', null);
			if (!exchange) {
				updatePayAmount('');
				return;
			}
			//let payAmount = new BigNumber(amount).times(new BigNumber(exchange)).toFixed(2);
			let payAmount
			if( this.props.depositSetting.roundRule === 'NONE'){
				payAmount = (amount * exchange).toFixed(2);
			}else if( this.props.depositSetting.roundRule === 'ROUNDING'){
				payAmount = Math.round((amount * exchange));
			}

			updatePayAmount(payAmount);
		} else {
			setFieldErrorText('depositAmountValidateErrorText', i18n['mobile.deposit.true.money.key']);
			updatePayAmount('')
		}
	}

	onAmountBlur = () => {
		let { depositPage, updateDepositAmount } = this.props;
		let { depositAmount } = depositPage;
		let isAmountValid = this.isAmountValid(depositAmount);
		if (!isAmountValid) return;
		let amount = new BigNumber(depositAmount).toFixed(2);
		updateDepositAmount(amount)
	}

	onComment = (val) => {
		let { updateComment } = this.props;
		updateComment(val);
	}

	renderExchangeTips = (exchange, payCurrency) => {
		if (!exchange) {
			return (
				<span className={css["red"]}>{i18n['mobile.deposit.load.exchange.err.key']}</span>
			)
		}
		return (
			<span>
				<span className={css["blue"]}>1</span>
				<span>{` USD ${i18n['mobile.deposit.conversion.key']} `}</span>
				<span className={css["blue"]}>{`${exchange} `}</span>
				<span>{payCurrency}</span>
			</span>
		)
	}

	render() {
		let { depositPage, selectedAccount, depositSetting, structuralList } = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let items = this.parseItems(selectedAccount);
		let {
    		exchange,
			depositAmount,
			depositAmountValidateErrorText,
			payAmount,
			payAmountValidateErrorText,
			payMethodValidateErrorText,
			comment,
			selectedPaymethod,
			currentRateSetting,
			params
		} = depositPage;
		let itemStyle = depositAmountValidateErrorText ? { marginBottom: "14px" } : { marginBottom: 0 };
		let selectStyle = payMethodValidateErrorText ? { marginBottom: "14px" } : { marginBottom: 0 };
		let { minDeposit, maxDeposit, payList } = depositSetting;
		let amountHintText = this.parseAmountHintText();
		let payCurrency = selectedPaymethod ? selectedPaymethod.currency : null;
		let apiAccToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let tenantId = window.GlobalVar.tenantId;
		let appId = window.GlobalVar.appId;
		let { mobileLogo } = this.props.brand;
		let notice = ''
		let	structural_list = structuralList && structuralList.length ? structuralList : JSON.parse(window.localStorage.getItem('LIST') || '{}')
		if (structural_list && structural_list.length){
			structural_list.forEach((item) => { 
				if (item.structural == selectedAccount.vendor){ 
					notice = item.depositSetting.notice
				}
			})
		}
		
		return (
			<Page>
				<PageContent>
					<AccountHeader items={items} vendor={selectedAccount.vendor} mobileLogo={mobileLogo}/>
					<div className={css["content"]}>
						<div className={css["top"]}>
							<InputItem
								title={i18n['fundflow.column.deposit.depositAmount']}
								hintText={amountHintText}
								errorText={depositAmountValidateErrorText}
								value={depositAmount}
								onChange={this.onDepositAmount}
								itemStyle={itemStyle}
								onBlur={this.onAmountBlur} />
							<Select
								items={payList}
								value={selectedPaymethod && selectedPaymethod.value}
								onChange={this.changePayMethod}
								title={i18n['mobile.deposit.payment']}
								errorText={payMethodValidateErrorText}
								rootStyle={selectStyle}
								hintText={i18n['mobile.deposit.change.payment']} />
							<InputItem
								title={i18n['fundflow.column.deposit.payAmount']}
								disabled={true}
								value={payAmount}
								hintText={`${i18n['mobile.deposit.auto.count']}（CNY）`}
								errorText={payAmountValidateErrorText}
								underlineDisabledStyle={underlineDisabledStyle} />
						</div>
						<div className={css["center"]}>
							<div
								className={css["item"]}
								style={{ display: currentRateSetting && currentRateSetting.showExchange == true ? 'block' : 'none' }} >
								<span>{i18n['mobile.deposit.current.exchange']}：</span>
								<span>{this.renderExchangeTips(exchange, payCurrency)}</span>
							</div>
							<div
								className={css["item"]}
								style={{
									display: depositSetting && depositSetting.showCharge == true ? 'block' : 'none'
								}} >
								<span>{i18n['withdraw.label.charge']}：</span>
								<span className={css["blue"]}>{depositSetting.charges}%</span>
							</div>
						</div>
						<div className={css["bottom"]}>
							<InputItem
								title={i18n['fundflow.column.common.comment']}
								value={comment}
								onChange={this.onComment}
							/>
						</div>
					</div>
					{
						notice && <div className={css['notice']}>
							<div className={css['notice-title']}>
								<img src={icon_announcement} />
								<span>{i18n['mobile.fundflow.notice']}</span>
							</div>
							<div className={css['notice-con']}>
								{notice}
							</div>
						</div>
					}
					<div className={css["footer"]}>
						<RaisedButton
							label={i18n['mockaccount.submit']}
							primary={true}
							buttonStyle={buttonStyle}
							overlayStyle={overlayStyle}
							style={style}
							labelStyle={labelStyle}
							onTouchTap={this.onSubmit}
						/>
					</div>
					<input ref="myInput" type="text" style={{opacity: 0}}/>
					<FormConfirmation
						contentStyle={contentStyle}
						title={i18n['mobile.deposit.confirm.info']}
						show={this.state.showConfirm}
						formFields={this.createConfirmationFormFields()}
						onCancel={this.onConfirmationCanel}
						onOK={this.onConfirmationOK}
					/>
					<form id="depositForm" method="post" action="/v1/mobile/payment/page" target="blank">
						<input type="hidden" name="q" value={new Date().getTime()} />
						<input type="hidden" name="depositRequest" value={JSON.stringify(params)} />
						<input type="hidden" name="x-api-token" value={getCachedToken()} />
						<input type="hidden" name="x-api-account-token" value={apiAccToken} />
						<input type="hidden" name="x-tenant-id" value={tenantId} />
						<input type="hidden" name="x-app-id" value={appId} />
					</form>
				</PageContent>
			</Page>
		)
	}
}