import React from 'react';
import css from './index.less';
import { getCachedUserInfo } from 'utils/userinfo';
import i18n from 'utils/i18n'

export class AccountHeader extends React.Component {
	static defaultProps = {
		isFirst: true
	}
	constructor(props) {
		super(props);
	}
	getGreetingText = () => {
		let text = '';
		let userinfo = getCachedUserInfo() || {};
		let username = userinfo.wxname || userinfo.name || '';
		let hours = new Date().getHours();
		if (hours >= 0 && hours <= 12) {
			text = `${i18n['mobile.morning.key']} ${username}`;
		} else if (hours > 12 && hours <= 18) {
			text = `${i18n['mobile.afternoon.key']} ${username}`;
		} else if (hours > 18 && hours <= 23) {
			text = `${i18n['mobile.evening.key']} ${username}`;
		}
		return text;
	}
	render() {
		let userinfo = getCachedUserInfo() || {};
		// let lastLoginTime = new Date(userinfo.lastLoginTime).toLocaleString();
		let style = this.props.isFirst ? css["taMobileAccountHeader"]
			: `${css["taMobileAccountHeader"]} ${css["taMobileAccountHeaderExtension"]}`;
		return (
			<div className={css['taMobileAccount']}>
				<div className={style}>
					<p className={css["greetings"]}>
						{this.getGreetingText()}
					</p>
					{
						this.props.isFirst ?
							<p className={css["thanks"]}>
								{i18n['mobile.thanks.use.key']}Trader Work
              </p> : null
					}
					{/*<p>
						上次登录：{lastLoginTime}
					</p>*/}
				</div>
			</div>
		);
	}
}