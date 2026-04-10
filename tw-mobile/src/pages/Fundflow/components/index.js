import React from 'react';
import { connect } from 'react-redux';
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment'

import { pxToRem } from '../../../utils/styleUtils';
import { Tabs, Tab } from 'material-ui/Tabs';
import css from './index.less';
import { CommonItem } from './CommonItem';
import { getCachedToken } from 'utils/userinfo';
import { transform, DATA_TYPE_DEPOSIT, DATA_TYPE_WITHDRAW, DATA_TYPE_TRANSFER } from './convert';
import { DatePicker } from 'widgets/DatePicker';
import { Storage } from 'utils/storage';
import { ApplicationNavigation } from 'widgets/ApplicationNavigation';
import { IScrollView } from 'widgets/IScrollView';
import i18n from 'utils/i18n'

import line from 'images/line.png'

let info = require('images/icon_info@3x.png');
let infoLight = require('images/icon_info_light@3x.png');
let accounts = require('images/icon_accounts@3x.png');
let accountsLight = require('images/icon_accounts_light@3x.png');

const DEPOSIT_TAB = 0;
const WITHDRAW_TAB = 1;
const TRANSFER_TAB = 2;
const pageSizeStep = 10;

let tabsArray = [
	{
		"key": "DEPOSIT_TAB",
		"value": 0,
		"state": "depositHistory"
	},
	{
		"key": "WITHDRAW_TAB",
		"value": 1,
		"state": "withdrawHistory"
	},
	{
		"key": "TRANSFER_TAB",
		"value": 2,
		"state": "transferHistory"
	}
]

let pageSizeMap = {
	[DEPOSIT_TAB]: 10,
	[WITHDRAW_TAB]: 10,
	[TRANSFER_TAB]: 10
}
// make 4 to 04, 5 to 05 ...etc
function leftPad(n) {
	if (n >= 10) {
		return n
	} else {
		return `0${n}`
	}
}


let tabItemContainerStyle = {
	background: "#fff",
	borderBottom: '1px solid #E0E0E0'
}

let buttonStyle = {
	color: "#939393",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
let curButtonStyle = {
    color: "#00a3fe",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}

let inkBarStyle = {
	backgroundColor: "#00a3fe"
}

let contentContainerStyle = {
	marginTop: '20px'
}

export class Fundflow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: DEPOSIT_TAB,
			showDatePicker: false,
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth() + 1,
			currentYearMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
			depositHistory: [],
			withdrawHistory: [],
			transferHistory: []
		};
	}

	_getDateRangeParams = (year, month) => {
		let firstDayOfMonth = new Date(year, month - 1, 1);
		let lastDayOfMonth = new Date(year, month, 0);
		let yyyy, mm, dd;
		yyyy = firstDayOfMonth.getFullYear();
		mm = leftPad(firstDayOfMonth.getMonth() + 1);
		dd = leftPad(firstDayOfMonth.getDate());
		let strFromDate = `${yyyy}-${mm}-${dd}`;

		yyyy = lastDayOfMonth.getFullYear();
		mm = leftPad(lastDayOfMonth.getMonth() + 1);
		dd = leftPad(lastDayOfMonth.getDate());

		let strToDate = `${yyyy}-${mm}-${dd}`;

		return {
			from: strFromDate,
			to: strToDate
		}
	}

	_fetchDepositData = () => {
		let { currentYear, currentMonth, currentYearMonth } = this.state;
		const { fetchDepositData } = this.props
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken
			}
		}
		let pageSize = pageSizeMap[DEPOSIT_TAB];
		let from = moment(`${currentYearMonth}-1`, 'YYYYMMDD').format('YYYY-MM-DD')
		let to = moment(`${currentYearMonth}-1`, 'YYYYMMDD').endOf('month').format('YYYY-MM-DD')
		let url = `/v1/mobile/fund/transaction?from=${from}&to=${to}&type=Deposit&size=${pageSize}&page=1`;
		fetchDepositData(url, options).then(res => {
			if (res && res.payload && res.payload.result) {
				let datas = transform(DATA_TYPE_DEPOSIT, res.payload.data.list);
				this.setState({ depositHistory: datas });
			}
		})
	}

	_fetchWithdrawData = () => {
		let { currentYear, currentMonth, currentYearMonth } = this.state;
		const { fetchWithdrawData } = this.props
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken
			}
		}
		let pageSize = pageSizeMap[WITHDRAW_TAB];
		let from = moment(`${currentYearMonth}-1`, 'YYYYMMDD').format('YYYY-MM-DD')
        let to = moment(`${currentYearMonth}-1`, 'YYYYMMDD').endOf('month').format('YYYY-MM-DD')
		let url = `/v1/mobile/fund/transaction?from=${from}&to=${to}&type=Withdraw&size=${pageSize}&page=1`
		fetchWithdrawData(url, options).then(res => {
			if (res && res.payload && res.payload.result) {
				let datas = transform(DATA_TYPE_WITHDRAW, res.payload.data.list);
				this.setState({ withdrawHistory: datas })
			}
		})
	}

	_fetchTransferData = () => {
		let { currentYear, currentMonth, currentYearMonth } = this.state;
		const { fetchTransferData } = this.props
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken
			}
		}
		let pageSize = pageSizeMap[TRANSFER_TAB];
		let from = moment(`${currentYearMonth}-1`, 'YYYYMMDD').format('YYYY-MM-DD')
        let to = moment(`${currentYearMonth}-1`, 'YYYYMMDD').endOf('month').format('YYYY-MM-DD')
		let url = `/v1/mobile/fund/transaction?from=${from}&to=${to}&type=Transfer&size=${pageSize}&page=1`
		fetchTransferData(url, options).then(res => {
			if (res && res.payload && res.payload.result) { 
				let datas = transform(DATA_TYPE_TRANSFER, res.payload.data.list);
				this.setState({ transferHistory: datas })
			}
		})
	}

	onScrollBottom = () => {
		let { currentTab } = this.state;
		pageSizeMap[currentTab] = pageSizeMap[currentTab] + pageSizeStep;
		this._loadData();
	}

	componentDidMount() {
		let { selectedAccount } = this.props;
		let self = this;
		this._handleTabsChange(this.state.currentTab);
	}

	_loadData = () => {
		let { currentTab } = this.state;
		switch (currentTab) {
			case DEPOSIT_TAB:
				{
					this._fetchDepositData();
					break;
				}
			case WITHDRAW_TAB:
				{
					this._fetchWithdrawData();
					break;
				}
			case TRANSFER_TAB:
				{
					this._fetchTransferData();
					break;
				}
			default: {
				this._fetchDepositData();
			}
		}
	}

	_handleTabsChange = (value) => {
		let currentTab = tabsArray.filter(tab => {
			return tab.value === value
		})[0];
		this.setState({
			[currentTab.state]: []
		}, () => {
			this.setState({ currentTab: value }, () => {
				this._loadData();
			});
		})
	}

	_openDatePicker = () => {
		this.setState({ showDatePicker: true })
	}

	_onDateChange = ({ year, month, day }) => {
		this.setState({
			currentYear: year,
			currentMonth: month,
			showDatePicker: false
		}, () => {
			this._loadData();
		})
	}

	_onCancelDate = () => { 
        this.setState({
            showDatePicker: false
        })
	}
	
	changeDate = (e) => { 
        let val = e.target.value
        if (val){ 
            this.setState({
                currentYear: val.split('-')[0],
                currentMonth: val.split('-')[1],
                currentYearMonth: val
            }, () => {
                this._loadData()
            })
        }
    }

	render() {
		let { selectedAccount } = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let account = selectedAccount.account;
		let fromApp = window.location.href.indexOf('fromApp') != -1
		return (
			<Page>
				<PageContent>
					<IScrollView onScrollBottom={this.onScrollBottom}>
						<div className={css["header"]}>
							<div className={`${css["left"]} ${css["column"]}`}>
								<span className={`${css["year"]} ${css["top"]}`}>{this.state.currentYear}</span>
								<span className={`${css["month"]} ${css["bottom"]}`}>
									<span>{this.state.currentMonth}{i18n['mobile.fundflow.month']}</span>
									<img src={line} className={css['line']} />
									<input onChange={this.changeDate} className={css['date-input']} type="month" />
								</span>
							</div>
							<div className={`${css["right"]} ${css["column"]}`}>
								<span className={css["top"]}>{i18n['fundflow.column.common.accountId']}:</span>
								<span className={css["bottom"]}>{account}</span>
							</div>
						</div>
						<div className={css["content"]}>
							<Tabs
								value={this.state.currentTab}
								tabItemContainerStyle={tabItemContainerStyle}
								inkBarStyle={inkBarStyle}
								contentContainerStyle={contentContainerStyle}
								onChange={this._handleTabsChange} >
								<Tab
									value={DEPOSIT_TAB}
									label={i18n['fundflow.tradeType.deposit']}
									style={{float:"left"}}
									buttonStyle={
										this.state.currentTab == DEPOSIT_TAB ? curButtonStyle : buttonStyle
									} >
									{
										this.state.depositHistory.length > 0 ?
										<div className={`${css["borderTB"]} ${css["mb30"]}`}>
											{
												this.state.depositHistory.map(o => {
													return <CommonItem type='1' key={Math.random() * 10} data={o} />
												})
											}
											
										</div> : <div></div>
									}
									{
										<div className={css['paddingBt']}></div>
									}
								</Tab>
								<Tab
									value={WITHDRAW_TAB}
									label={i18n['fundflow.tradeType.withdraw']}
									style={{float:"left"}}
									buttonStyle={
										this.state.currentTab == WITHDRAW_TAB ? curButtonStyle : buttonStyle
									} >
									{
										this.state.withdrawHistory.length > 0 ? 
										<div className={`${css["borderTB"]} ${css["mb30"]}`}>
											{
												this.state.withdrawHistory.map(o => {
													return <CommonItem type='2' key={o.id} data={o} />
												})
											}
												
										</div> : <div></div>
									}
									{
										<div className={css['paddingBt']}></div>	
									}
								</Tab>
								<Tab
									value={TRANSFER_TAB}
									label={i18n['fundflow.tradeType.transfer']}
									style={{float:"left"}}
									buttonStyle={
										this.state.currentTab == TRANSFER_TAB ? curButtonStyle : buttonStyle
									} >
									{
										this.state.transferHistory.length > 0 ?
										<div className={`${css["borderTB"]} ${css["mb30"]}`}>
											{
												this.state.transferHistory.map(o => {
													return <CommonItem type='3' key={o.id} data={o} />
												})
											}
											
										</div> : <div></div>
									}
									{
										<div className={css['paddingBt']}></div>
									}
								</Tab>
							</Tabs>
						</div>
					</IScrollView>
				</PageContent>
				<PageFooter style={fromApp ? {display: 'none'} : {}}>
					<ApplicationNavigation />
				</PageFooter>
			</Page>
		)
	}
}
