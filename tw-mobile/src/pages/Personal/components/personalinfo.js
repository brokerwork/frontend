import React, { Component } from 'react';
import { IconTitleTextField } from './IconTitleTextField';
import { getCachedUserInfo } from 'utils/userinfo';
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import { pxToRem } from 'utils/styleUtils';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {ApplicationNavigation} from 'widgets/ApplicationNavigation'
import css from './personalinfo.less';

import i18n from 'utils/i18n'
import language from 'utils/language';
import wxUtils from 'utils/wxUtils'

const accountNameIcon = require("images/icon_name@3x.png");
const emailIcon = require("images/icon_email@3x.png");
const phoneIcon = require("images/icon_phone_number@3x.png");
const wechatIcon = require("images/icon_weixinblue@3x.png");
import iconLanguage from 'images/icon_language.png'
import downArrow from 'images/downArrow.png'

const selectVal = {
	'zh-CN': '简体中文',
	'en-US': 'English',
	'zh-TW': '繁体中文',
	'ja-JP': '日本語',
}

const contentStyle = {
	fontSize: '14px'
}

export class PersonalInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: 0,
			language: selectVal[language.getType()],
			open: false,
		}
	}
	componentDidMount() {
		let {fetchPersonalInfo} = this.props;
		fetchPersonalInfo();
	}

	selectLanguage = (e) => {
		let val = e.target.value
		const { changeLanguage } = this.props
		this.setState({
			language: selectVal[val]
		})
		changeLanguage(val)
	}

	personalLogout = () => { 
		this.setState({open: true})
	}

	affirmLogout = () => {
		const { logout } = this.props
		logout().then((res) => { 
			if (res && res.payload && res.payload.result){ 
				localStorage.removeItem('USER_INFO')
				localStorage.removeItem('TOKEN')
				if (wxUtils.isWechat()) {
					window.location.href = wxUtils.getPreSignupURL()
				} else { 
					window.location.href = '/'
				}
			}
		})
	}

	handleClose = () => {
		this.setState({open: false})
	}

	render() {
		let {
			username,
			wxname,
			email,
			phone,
		} = this.props;
		const actions = [
			<FlatButton
				label={i18n['general.button.cancel']}
				primary={true}
				onClick={this.handleClose}
			/>,
			<FlatButton
				label={i18n['general.confirm.tw']}
				primary={true}
				keyboardFocused={true}
				onClick={this.affirmLogout}
			/>
		]
		return (
			<Page className={css["taMobileAccount"]} style={{backgroundColor: '#FAFAFA'}}>
				<PageContent>
					<div>
						<div className={css["title"]}>
							{i18n['tausermgmt.basic.info']}
        				</div>
						<div className={css["wrapper"]}>
							<IconTitleTextField iconSrc={accountNameIcon}
								value={username}
								title={i18n['tausermgmt.username']} />
							<IconTitleTextField iconSrc={emailIcon}
								value={email}
								title={i18n['signup.email']} />
							<IconTitleTextField iconSrc={phoneIcon}
								value={phone}
								title={i18n['signup.mobile']} />
							<IconTitleTextField iconSrc={wechatIcon}
								value={wxname}
								title={i18n['mobile.wechat.user.key']} />
							<div className={css['wrapper-bottom']}></div>
						</div>
						<div style={{marginTop: pxToRem(20)}} className={css['wrapper']}>
							<IconTitleTextField
								iconSrc={iconLanguage}
								title={this.state.language} />
							<img className={css['down_arrow']} src={downArrow} />
							<select
								defaultValue={language.getType()}	
								onChange={this.selectLanguage}	
								className={css['selector']}>
								<option value='' disabled={true}>{i18n['mobile.language.set']}</option>
								<option value='zh-CN'>简体中文</option>
								<option value='en-US'>English</option>
								<option value='zh-TW'>繁体中文</option>
								<option value='ja-JP'>日本語</option>
							</select>
						</div>
						<div onClick={this.personalLogout} className={css['personal-logout']}>
							{i18n['mobile.logout']}
						</div>
						<Dialog
							actions={actions}
							modal={false}
							bodyStyle={contentStyle}
							open={this.state.open}
							onRequestClose={this.handleClose}>
							{i18n['mobile.affirm.logout']}
						</Dialog>
					</div>
				</PageContent>
				<PageFooter>
					<ApplicationNavigation defaultSelectedIndex={2}/>
				</PageFooter>
			</Page>

		)
	}
}