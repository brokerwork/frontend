/**
 *  模拟账户开户成功页
 */

import React from 'react';
import createFragment from 'react-addons-create-fragment';
import { connect } from 'react-redux';

//  component
import RaisedButton from 'material-ui/RaisedButton';
import { FullPagePaperComponent } from 'widgets/FullPagePaperComponent';
import { OpenAcctSuccess } from './openAcctSuccess';
import { Item } from './Item';
import i18n from 'utils/i18n';

//  css
import {
	textStyle,
	underlineStyle,
	buttonStyle,
	overlayStyle,
	style
} from "./openAcctSuccessStyle";

let fullPagePaperStyle = {
	background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

const paperStyle = {
	padding: 0
}

export class OpenMockAcctSuccess extends React.Component {

	componentDidMount() {
	}

	_openAccountsURL = () => {
		this.props.router.push("/accounts")
	}

	_getItems = () => {
		let {
            selectedServer,
			accountName,
			newAccount,
			newAccountPassword,
			newAccountInvestorPassword
        } = this.props;
		return [
			{
				src: require("images/icon_server@3x.png"),
				title: `${i18n['bindaccount.server']}:`,
				content: selectedServer.serverName
			},
			{
				src: require("images/icon_name@3x.png"),
				title: `${i18n['mobile.account.name.key']}:`,
				content: accountName
			},
			{
				src: require("images/icon_account_number@3x.png"),
				title: `${i18n['fundflow.column.common.accountId']}:`,
				content: newAccount
			},
			{
				src: require("images/icon_transaction_password@3x.png"),
				title: `${i18n['mobile.trade.pswd']}:`,
				content: newAccountPassword
			},
			{
				src: require("images/icon_jurisdiction@3X.png"),
				title: `${i18n['mobile.readonly.pswd']}:`,
				content: newAccountInvestorPassword
			}
		];
	}

	render() {
		let items = this._getItems();
		return (
			<FullPagePaperComponent
				style={fullPagePaperStyle}
				paperStyle={paperStyle}
			>
				<OpenAcctSuccess
					title={i18n['mobile.mock.account.suc']}
					items={items}
					description={i18n['mobile.info.send.email']}
					onTouchTap={this._openAccountsURL}
				/>
			</FullPagePaperComponent>
		)

	}

}