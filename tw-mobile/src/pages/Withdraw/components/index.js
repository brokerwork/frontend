/**
 *  在线出金页
 */

import React from 'react';

// component
import { Page, PageContent } from 'widgets/PageWrapper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { AccountHeader } from '../../AccountSinglePage/components/AccountHeader';
import { InputItem } from 'widgets/InputItem';
import { Select } from 'widgets/Select';
import { SuccessDialog } from './SuccessDialog';
import { WithDrawForm } from './WithDrawForm';
import i18n from 'utils/i18n'

// css
import css from "./index.less";
import {
	buttonStyle,
	overlayStyle,
	style,
	labelStyle,
	underlineDisabledStyle
} from "./style";

//  utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { Storage } from 'utils/storage';
import { post, get } from '../../../utils/api';
import { UserInfo, getCachedToken, getCachedUserInfo } from 'utils/userinfo';
import icon_announcement from 'images/icon_announcement.png'

import {
	hasMinDepositLimit,
	checkExchangeRateSettings,
	checkSelectedAccount,
	checkPayList,
	checkExchange,
	hasDepositSetting,
} from '../checkArguments';
export class WithDraw extends React.Component {
	constructor() {
		super();
		let errorField = {
			swiftError: null,
			bankAccountNameError: null,
			bankAccountNumberError: null,
			bankAddressError: null,
			bankBranchNameError: null,
			bankNameError: null,
			commentError: null,
			currencyError: null,
			payCurrencyError: null,
			withdrawAmountError: null,
			withdrawExchangeError: null,
		}
		let params = {
			curMaxWithdrawAmount: '',
			swift: '',
			bankAccountName: '',
			bankAccountNumber: '',
			bankAddress: '',
			bankBranchName: '',
			bankName: '',
			comment: '',
			currency: '',
			payCurrency: '',
			withdrawAmount: '',
			withdrawExchange: '',
		};
		this.state = {
			params: params,
			showSuccessModal: false,
			errorField: errorField,
			bindBanks: []
		}
		this.bankNameObj = {}
	}
	
	componentDidMount() {
		let {getBankList, getBankInfo,  selectedAccount, getAccountWithDrawInfo, getAmount} = this.props; 
		let copyData = Object.assign(this.state.params, {});
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
			if (!selectedAccount.account && select_account) { 
				selectedAccount = select_account		
			}
		Promise.all([
			getAccountWithDrawInfo(selectedAccount.vendor),
			getBankInfo(),
			getBankList(),
			getAmount()
		]).then(rs => {
			const { withDrawPage } = this.props;
			const { bankInfo, bankList, curMaxWithdrawAmount } = withDrawPage;
			copyData['curMaxWithdrawAmount'] = curMaxWithdrawAmount || 0
			
			this.banks = rs[1].payload.data
			let data = this.banks.filter(el=>{
				return el.isDefault
			})[0]
			rs[2].payload.data.forEach(el => {
				this.bankNameObj[el.value] = el.label
			})
			let bindBanks = bankInfo.map(el=>{
				return {
					number: el.bankAccountNumber,
					name: `${i18n['withdraw.lastBankNumber']}${el.bankAccountNumber.substr(-4,4)} ${el.bankAccountName}` 
				}
			})
			this.setState({
				params: copyData,
				bindBanks
			})
			this.fillBankInfo(data)


	  })
	}
	fillBankInfo =(data)=>{
		let params = {...this.state.params}
		params.bankAccountNumber = data.bankAccountNumber
		params.bankAccountName = data.bankAccountName
		params.bankName = data.bankName
		params.bankBranchName = data.bankBranchName
		params.swift = data.SWIFT
		params.bankAddress = data.bankAddress
		this.setState({
			params: params
		})
	}
	changeBank = (e)=>{
		let value = e.target.value
		
		let data = this.banks.filter(el=>{
			return value === el.bankAccountNumber
		})[0]
		this.fillBankInfo(data)
	}
	valid = (type, value) => {
		let copyData = Object.assign(this.state.errorField, {});
		switch (type)
		{
		case 'bankAccountName':
			if (value.length === 0){
				copyData[`${type}Error`] = i18n['mobile.withdraw.payee.name'];
			}else {
				copyData[`${type}Error`] = null;
			}
  		break;
		case 'bankAccountNumber':
  		if (value.length === 0){
				copyData[`${type}Error`] = i18n['mobile.withdraw.bank.account'];
			}else {
				copyData[`${type}Error`] = null;
			}
  		break;
		case 'bankName':
  		if (!value){
				copyData[`${type}Error`] = i18n['mobile.withdraw.bank'];
			}else {
				copyData[`${type}Error`] = null;
			}
			break;
		case 'withdrawAmount':
  		if (value.length === 0 || !this.isWithdrawAmountValid(value)){
				copyData[`${type}Error`] = value.length === 0 ? i18n['mobile.withdraw.out.money'] : i18n['mobile.withdraw.right.money'];
			}else {
				copyData[`${type}Error`] = null;
			}
  	break;
		}
    return copyData;
	}

	submitValidation = () => {
		let result = true;
		const {params} = this.state;
		let copyData = Object.assign(this.state.errorField, {});
		const {
			swift,
			bankAccountName,
			bankAccountNumber,
			bankAddress,
			bankBranchName,
			bankName,
			comment,
			currency,
			payCurrency,
			withdrawAmount,
			withdrawExchange,
		} = params;
		if (!withdrawAmount) {
			result = false;
			copyData['withdrawAmountError'] = i18n['mobile.withdraw.out.right.money'];
		}
		if (!bankName) {
			result = false;
			copyData['bankNameError'] = i18n['mobile.withdraw.bank'];
		}
		if (!bankAccountNumber) {
			result = false;
			copyData['bankAccountNumberError'] = i18n['mobile.withdraw.bank.account'];
		}
		if (!bankAccountName) {
			result = false;
			copyData['bankAccountNameError'] = i18n['mobile.withdraw.payee.name'];
		}
		this.setState({
			errorField: copyData
		});
		return result;
	}

  	onSubmit = () => {
			const { params } = this.state;
		let {postWithdrawApply, withDrawPage, selectedAccount} = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
			if (!selectedAccount.account && select_account) { 
				selectedAccount = select_account		
		}
		if (!this.submitValidation()) return false;
		const {withDrawInfo} = withDrawPage;
		let copyData = {...params}
		let currencyOb = null
		withDrawInfo.exchangeRateSettings.forEach((ob) => { 
			if (ob.payCurrency === 'CNY') { 
				currencyOb = ob
			}
		})
		copyData['bankName'] = this.bankNameObj[params['bankName']];
		copyData['currency'] = selectedAccount.currency;
		copyData['paycurrency'] = currencyOb ? 'CNY' : withDrawInfo.exchangeRateSettings[0].payCurrency;
		copyData['withdrawExchange'] = currencyOb ? currencyOb.exchange : withDrawInfo.exchangeRateSettings[0].exchange;
		Promise.resolve(postWithdrawApply(copyData)).then((res) => {
			if (res && res.payload && res.payload.result) {
				if (window.location.href.indexOf('fromApp') != -1) {
					window.postMessage(JSON.stringify({ result: true }), '*')
				} else { 
					this.setState({
						showSuccessModal: true
					});
				}
			}
		});
	}

	gotoAccountPage = () => {
		this.props.router.replace('/accounts')
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

	isWithdrawAmountValid = (val) => {
		let reg = /^[0-9]+(\.?[0-9]+)?$/;
		if (!reg.test(val)) return false;
		return reg.test(val);
	}

	onParamChange = (type, value) => {
		const {params} = this.state;
		let copyData = Object.assign(params, {});
		copyData[type] = value;
		let copyError = this.valid(type, value);
		this.setState({
			params: copyData,
			errorField: copyError
		});
	}
  	render() {
		let { withDrawPage, selectedAccount, depositSetting, structuralList } = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		const { params, showSuccessModal, errorField, bindBanks } = this.state;
		const items = this.parseItems(selectedAccount);
		
		let notice = ''
		let	structural_list = structuralList && structuralList.length ? structuralList : JSON.parse(window.localStorage.getItem('LIST') || '{}')
		if (structural_list && structural_list.length){ 
			structural_list.forEach((item) => { 
				if (item.structural == selectedAccount.vendor){ 
					notice = item.withdrawSetting.notice
				}
			})
		}	
		return (
			<Page>
				<PageContent>
				<div>
					<AccountHeader items={items} vendor={selectedAccount.vendor} />
					<div className={css["content"]}>
						<div className={css["top-content"]}>
							<div className={css['money-desc']}>
									<div className={css['money-label']}>{i18n['deposit.depositAmount']}({selectedAccount.currency})</div>
								<div className={css['money-content']}>{selectedAccount.balance}</div>		
							</div>
						</div>
						<WithDrawForm  
						{...this.props} 
						onChange={this.onParamChange} 
						changeBank={this.changeBank}
						bindBanks={bindBanks}
						errorField={errorField}
						params={params} />
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
								label={i18n['general.submit.tw']}
								primary={true}
								buttonStyle={buttonStyle}
								overlayStyle={overlayStyle}
								style={style}
								labelStyle={labelStyle}
								onTouchTap={this.onSubmit}/>
					</div>
				</div>
					{showSuccessModal
					? <SuccessDialog
						title={i18n['mobile.withdraw.out.hint']}
						open={true}
						handleConfirm={this.gotoAccountPage}
						confirmText={i18n['tausermgmt.confirm']}
						onRequestClose={() => { this.setState({ showSuccessModal: false }) }} >
						{i18n['mobile.withdraw.out.submited']}
						</SuccessDialog>
						: undefined
					}
				</div>
				</PageContent>
			</Page>
		)
    }
}
	