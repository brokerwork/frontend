/**
 *  开通真实账户成功页
 */
import React from 'react';
import { FullPagePaperComponent } from 'widgets/FullPagePaperComponent'
import { OpenAcctSuccess } from '../../OpenMockAcctSuccess/components/openAcctSuccess'
import i18n from 'utils/i18n';

let fullPagePaperStyle = {
	background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

const paperStyle = {
	padding: 0
}

export class OpenRealAcctSuccess extends React.Component {


	_openAccountsURL = () => {
		this.props.router.push("/accounts")
	}

	_getItems = () => {
		let {
				accountName,
			selectedServer
		} = this.props;
		return [
			{
				src: require("images/icon_server@3x.png"),
				title: i18n['bindaccount.server'],
				content: selectedServer ? selectedServer.serverName : '' //  将来要用 this.props.xxx 替换
			},
			{
				src: require("images/icon_name@3x.png"),
				title: i18n['mobile.account.name.key'],
				content: accountName   //  将来要用 this.props.xxx 替换
			}
		]
	}

	render() {
		let description = i18n['mobile.open.account.send.email']
		let items = this._getItems();
		return (
			<FullPagePaperComponent
				style={fullPagePaperStyle}
				paperStyle={paperStyle}
			>
				<OpenAcctSuccess
					title={i18n['mobile.fast.open.account']}
					items={items}
					description={description}
					onTouchTap={this._openAccountsURL}
				/>
			</FullPagePaperComponent>
		)
	}
}



