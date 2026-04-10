/**
 *  在线出金页
 */

import React from 'react';

// component
import { Page, PageContent } from 'widgets/PageWrapper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import { InputItem } from 'widgets/InputItem';
import { Select } from 'widgets/Select';
import i18n from 'utils/i18n'
import downIcon from 'images/icon_phoneDown.png';

// css
import css from "./WithDrawForm.less";
import {
	buttonStyle,
	overlayStyle,
	style,
	labelStyle,
	underlineDisabledStyle
} from '../style.js';

//  utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { Storage } from 'utils/storage';
import { post, get } from 'utils/api';
import { UserInfo, getCachedToken, getCachedUserInfo } from 'utils/userinfo';

import {
	hasMinDepositLimit,
	checkExchangeRateSettings,
	checkSelectedAccount,
	checkPayList,
	checkExchange,
	hasDepositSetting,
} from '../../checkArguments';

let selStyle = {
	paddingLeft: pxToRem(200),
	fontSize: fontSizeByDPR(30),
}

let hintStyle = {
	left: pxToRem(200),
	fontSize: fontSizeByDPR(28),
	bottom: '50%',
	transform: 'translateY(50%)'
}
export class WithDrawForm extends React.Component {
	parseItems = (selectedAccount) => {
		if (!checkSelectedAccount(selectedAccount)) return;
		let { account, accountName, currency } = selectedAccount;
		return [
			{ "title": `${i18n['fundflow.column.common.accountId']}:`, "content": account },
			{ "title": `${i18n['mobile.account.name.key']}:`, "content": accountName },
			{ "title": `${i18n['deposit.currency']}:`, "content": currency }
		]
	}

	onParamsChange = (type, value) => {
		const {onChange} = this.props;
		if(type === 'bankName'){
			//onChange('bankAccountNumber', '');
		}	
	  onChange && onChange(type, type === 'bankName'?value.value: value);
	}
	bankChange = (type, bankList, event) => { 
		
		let obj = this.querySelectedPayPlatform(bankList, event.target.value)
		this.onParamsChange(type, obj[0])
	}
	querySelectedPayPlatform = (bankList, value) => {
		if (!bankList) {
			return
		}
		return bankList.filter((obj) => {
			return obj.value === value
		})
	}
	
  	render() {
			const {withDrawPage, selectedAccount, params, errorField, bindBanks, changeBank} = this.props;
			const {
				curMaxWithdrawAmount,
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
			const {
				swiftError,
				bankAccountNameError,
				bankAccountNumberError,
				bankAddressError,
				bankBranchNameError,
				bankNameError,
				commentError,
				currencyError,
				payCurrencyError,
				withdrawAmountError,
				withdrawExchangeError,
			} = errorField;
			let { bankList } = withDrawPage;
			let itemStyle = { marginBottom: 0 };
			let selectStyle = { marginBottom: 0};
			let errorStyle = { marginBottom: '14px' };
			let itemTopStyle = Object.assign({}, itemStyle, { borderTop: '1px solid #EDEDED' })
			let errorTopStyle = Object.assign({}, errorStyle, { borderTop: '1px solid #EDEDED' })
      return (
		  <div className={css["middle-content"]}>
			  <div className={css["basic-content"]}>
				<InputItem
					title={i18n['withdraw.actualBalance']}
					disabled={true}
					value={''+curMaxWithdrawAmount}
					underlineDisabledStyle={underlineDisabledStyle}
					itemStyle={itemTopStyle}/>
				<InputItem
					title={i18n['withdraw.amount']}
					hintText={i18n['withdraw.amount']}
					errorText={withdrawAmountError}
					value={withdrawAmount}
					onChange={this.onParamsChange.bind(this, 'withdrawAmount')}
					itemStyle={withdrawAmountError ? errorTopStyle : itemStyle} />
				
				<InputItem
					value={bankAccountNumber}
					onChange={this.onParamsChange.bind(this, 'bankAccountNumber')}
					title={i18n['userinfo.bank.account']}
					errorText={bankAccountNumberError}
					itemStyle={bankAccountNumberError ? errorStyle : itemStyle}
					hintText={i18n['userinfo.bank.account']}>
						<select onChange={this.props.changeBank} style={{position: 'absolute',top: 15,right: 0,background: 'transparent',
    border: 0,
    'z-index': 111,
    color: '#fff'}}>
							{
								bindBanks.map(el=>{
									return <option value={el.number}>{el.name}</option>
								})
							}
						</select>
						<img src={downIcon} className={css['down-icon']}/>
				</InputItem>
				{/* <Select
					items={bankList}
					value={bankName ? bankName.value : null}
					onChange={this.onParamsChange.bind(this, 'bankName')}
					title={i18n['withdraw.bankName']}
					selectStyle={selStyle}
					hintStyle={hintStyle}  
					errorText={bankNameError}
					rootStyle={selectStyle}
						hintText={i18n['withdraw.bankName']} /> */}
				<InputItem
					title={i18n['userinfo.bank.payee']}
					hintText={i18n['userinfo.bank.payee']}
					errorText={bankAccountNameError}
					value={bankAccountName}
					onChange={this.onParamsChange.bind(this, 'bankAccountName')}
					itemStyle={bankAccountNameError ? errorStyle : itemStyle} />
				<div className={css['expectation-select']}>
					<span className={css['expect-title']}>{i18n['withdraw.bankName']}</span>    
					<select
						style={bankName ? { color: 'rgba(0,0,0,0.87)' } : {color: 'rgba(0,0,0,0.3)'}}
						onChange={this.bankChange.bind(this, 'bankName', bankList)}
						value={bankName}>
						<option disabled value=''>{i18n['withdraw.bankName']}</option>
						{
							bankList && bankList.map((item, index) => { 
								return <option key={index} value={item.value}>{item.label}</option>
							})
						}
					</select>
					<img src={downIcon} className={css['down-icon']}/>
				</div>
				<InputItem
					title={i18n['withdraw.bankBranchName']}
					hintText={i18n['withdraw.bankBranchName']}
					errorText={bankBranchNameError}
					value={bankBranchName}
					onChange={this.onParamsChange.bind(this, 'bankBranchName')}
					itemStyle={bankBranchNameError ? errorStyle : itemStyle} />
				<InputItem
					title={"swift"}
					hintText={'swift'}
					errorText={swiftError}
					value={swift}
					onChange={this.onParamsChange.bind(this, 'swift')}
					itemStyle={swiftError ? errorStyle : itemStyle} />
				<InputItem
					title={i18n['userinfo.bank.address']}
					hintText={i18n['userinfo.bank.address']}
					errorText={bankAddressError}
					value={bankAddress}
					onChange={this.onParamsChange.bind(this, 'bankAddress')}
					itemStyle={bankAddressError ? errorStyle : itemStyle} />
				</div>
				<div className={css['comment-field']}>
					<InputItem
					title={i18n['fundflow.column.common.comment']}
					hintText={i18n['fundflow.column.common.comment']}
					errorText={commentError}
					value={comment}
					onChange={this.onParamsChange.bind(this, 'comment')}
					itemStyle={commentError ? errorTopStyle : itemTopStyle} />
				</div>
			</div>
        )
    }
}
