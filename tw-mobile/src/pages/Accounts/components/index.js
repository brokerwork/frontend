import React from 'react';
import { connect } from 'react-redux';
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { Header } from "widgets/Header";
import { AccountHeader } from './AccountHeader/index';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Avatar } from 'material-ui/Avatar';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import { AccountGroup } from './AccountGroup';
import css from './index.less';
import cssLogin from 'pages/Login/components/login.less';
import { pxToRem } from '../../../utils/styleUtils';
import i18n from 'utils/i18n'
import { get } from '../../../utils/api'
import { Dialog } from 'widgets/Dialog'

import { ConfirmDialog } from './ConfirmDialog';
import { DisclaimerCard } from './DisclaimerCard';
import RaisedButton from 'material-ui/RaisedButton';
import AccountList from '../containers/AccountList';
import { ApplicationNavigation } from 'widgets/ApplicationNavigation';
import rightImg from 'images/change_right.png'
/* ---------------------- main --------------------------- */

const style = {
	width: '100%',
	marginTop: pxToRem(100),
}

export class Accounts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			IsAppendAccount: null,
			serverName: 'MT4',
			isShowConfirmCard: false,
		};
	}

	componentDidMount() {
		const { fetchAccounts, getStructuralList } = this.props;
		getStructuralList().then((res) => {
			if (res && res.payload && res.payload.result){
				window.localStorage.setItem('LIST', JSON.stringify(res.payload.data))
			}
		})
		fetchAccounts()
	}

	//	关闭开通服务器弹窗
	handleClose = () => {
		this.setState({open: false})
	}
	//	打开服务器选择弹框
	openDialog = (params) => { 
		this.setState({
			open: true,
			IsAppendAccount: params
		})
	}

	//	开户选择服务器
	setServer = (server) => { 
		this.setState({
			serverName: server
		})
	}
	//	立即开通
	fastOpen = (event) => { 
		event.preventDefault()
		const { fastOpenAble } = this.props
		let { serverName, IsAppendAccount } = this.state
		fastOpenAble(serverName).then((res) => { 
			if (res && res.payload) {
				if (res.payload.data) {
					this.props.router.push(`/accounts/open/real${IsAppendAccount ? `/${IsAppendAccount}` : ''}`)
				} else { 
					this.props.router.push(`/accounts/openAcct/${serverName}`)
				}
			}
		})
	}

	render() {
		const { structuralList } = this.props
		let basicSettingMt4 = {}
		let basicSettingMt5 = {}
		structuralList && structuralList.length && structuralList.forEach((item) => { 
			if (item.structural == 'MT4') { 
				basicSettingMt4 = item.basicSetting
			}
			if (item.structural == 'MT5') { 
				basicSettingMt5 = item.basicSetting
			}
		})
		let cardActions = [
			<RaisedButton primary={true}
				style={{ width: '100%' }}
				buttonStyle={{ backgroundColor: 'rgb(0, 163, 254)' }}
				label={i18n['mobile.know.key']}
				onTouchTap={() => { this.setState({ isShowConfirmCard: false }) }} />
		]
		
		return (
			<Page className={css["taMobileAccount"]}>
				<PageContent>
					<AccountList openDialog={this.openDialog} />
					<DisclaimerCard
						actions={cardActions}
						show={this.state.isShowConfirmCard} />
					<Dialog
						titleStyle={{ textAlign: 'center' }}	
						title={i18n['mobile.server.required']}	
						modal={false}
						open={this.state.open}
						onRequestClose={this.handleClose}>
						<div className={css['change-server-confirm']}>
							{
								basicSettingMt4.enabled && <div onClick={this.setServer.bind(this, 'MT4')} className={css['server-list']}>
									<span>{basicSettingMt4.structuralName}</span>
									<div className={css['server-right']}>
										{
											this.state.serverName == 'MT4' && <img src={rightImg}/>
										}	
									</div>
								</div>
							}	
							{
								basicSettingMt5.enabled && <div onClick={this.setServer.bind(this, 'MT5')} className={css['server-list']}>
									<span>{basicSettingMt5.structuralName}</span>
									<div className={css['server-right']}>
										{
											this.state.serverName == 'MT5' && <img src={rightImg}/>
										}	
									</div>
								</div>
							}
						</div>
						<RaisedButton
							style={style}
							label={i18n['mobile.fast.open']}
							primary={true}
							onClick={this.fastOpen}/>
					</Dialog>
				</PageContent>
				<PageFooter>
					<ApplicationNavigation
						visibleData={this.props.visibleData}
						defaultSelectedIndex={0}/>
				</PageFooter>
			</Page>
		);
	}
}