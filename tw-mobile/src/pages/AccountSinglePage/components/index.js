/**
 *  账户单页
 */

import React from 'react';
//  component
import { Page, PageContent } from 'widgets/PageWrapper';
import PrivateUI from 'widgets/PrivateUI'
import { AccountHeader } from './AccountHeader';
import { List, ListItem } from 'material-ui/List';
import { TwListItem } from './TwListItem';
import i18n from 'utils/i18n'
import { Storage } from 'utils/storage';
//  css
import css from "./index.less";

let src1 = require("images/deposit.png")
let src2 = require("images/lever.png")
let src3 = require('images/tradeReport2.png')
let src4 = require('images/reports.png')
let src5 = require("images/tradeReport.png")
let src6 = require("images/telegraphic.png")

export class AccountSinglePage extends React.Component {

	parseItems = (acct) => {
		if (!acct) {
			return [];
		}
		return [
			{ "title": `${i18n['fundflow.column.common.accountId']}:`, "content": acct.account },
			{ "title": `${i18n['mobile.account.name.key']}:`, "content": acct.accountName }
		]
	}

	handleDeposit = () => {
		this.toUrl("/accounts/singlepage/deposit");
	}

	handleFundflow = () => {
		this.toUrl("/accounts/singlepage/fundflow")
	}
	
	handleLeverage = () => {
		this.toUrl('/accounts/singlepage/leverage')
	}

	handleTradereports = () => { 
		this.toUrl('/accounts/singlepage/tradereports')
	}

	handleWithDraw = () => {
		  this.toUrl("/accounts/singlepage/withdraw")
	}

	handleTelegraphic = () => { 
		this.toUrl("/accounts/singlepage/telegraphic")
	}
	
	toUrl = (route) => { 
		this.props.router.push(route)
	}

	render() {
		let basicSetting = {}
		let { selectedAccount, structuralList } = this.props;
		let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
		let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
		}
		if (structuralList && structuralList.length > 0) { 
            structuralList.forEach((item) => { 
                if (item.structural == selectedAccount.vendor) {
					basicSetting = item.basicSetting
                }
            })
        }
		let items = this.parseItems(selectedAccount);

		return (
			<Page>
				<PageContent>
					<AccountHeader items={items} vendor={selectedAccount.vendor} />
					<div className={css["trade-modules"]}>
						<PrivateUI
							visible={basicSetting.enableOnlineDeposit}>
							<TwListItem
								leftImageSrc={src1}
								text={i18n['menu.fundmgmt.deposit']}
								onTouchTap={this.handleDeposit} />
						</PrivateUI>
						<PrivateUI
							visible={basicSetting.provideTelegraphic}>
							<TwListItem
								leftImageSrc={src6}
								text={i18n['menu.fundmgmt.telegraphic']}
								onTouchTap={this.handleTelegraphic} />
						</PrivateUI>
						<PrivateUI
							visible={basicSetting.allowChangeLeverage}>
							<TwListItem
								leftImageSrc={src2}
								text={i18n['menu.adjust.leverage']}
								onTouchTap={this.handleLeverage}/>
						</PrivateUI>
						<PrivateUI
							visible={true}>
							<TwListItem
								leftImageSrc={src3}
								text={i18n['menu.fundmgmt.fundflow']}
								onTouchTap={this.handleFundflow} />
						</PrivateUI>
						<PrivateUI
							visible={basicSetting.allowViewHistoryOrder||basicSetting.allowViewOrder||basicSetting.allowViewPosition}>
							<TwListItem
								leftImageSrc={src4}
								text={i18n['tradereport.reports']}
								onTouchTap={this.handleTradereports} />
						</PrivateUI>
						<PrivateUI
							visible={basicSetting.enableOnlineWithdraw}>
							<TwListItem
								leftImageSrc={src5}
								text={i18n['menu.fundmgmt.withdraw']}
								onTouchTap={this.handleWithDraw} />
						</PrivateUI>
					</div>
				</PageContent>
			</Page>
		)

	}

}