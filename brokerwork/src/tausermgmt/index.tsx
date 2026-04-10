import { AppHeader } from "../header/index";
require('es6-shim');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Panel } from 'fooui';
import { AppFooter } from '../footer';
import { InterceptorLoader, InterceptorNames } from '../common/interceptorLoader';
import { LoadingMask } from 'fooui';
import setPageTitle from '../common/setPageTitle';
import {I18nLoader} from '../i18n/loader';

interface P { }
interface S {
	taUserMgmtUrl: string;
}

class App extends React.Component<P, S>{
	constructor(props: P) {
		super(props)
		this.state = { taUserMgmtUrl: null }
    setPageTitle(I18nLoader.get('navigation.ta_user_management'));
	}

	componentWillMount() {
		let token = sessionStorage.getItem('TOKEN');
		let taUserMgmtUrl = `/tauser?t=${token}&random=${Math.random()}`; // -- /tauser is from nginx, link to TA-User

		$.ajax({ url: taUserMgmtUrl }).then(res => {
			if (res.result == false && res.mcode == "PUB_AUTH_0000018") { //用户token已过期，点击TW用户管理，直接跳入登录页
				window.location.href = window.location.protocol + '//' + window.location.hostname;
			} else { // 接口返回了tauser的页面
				this.setState({ taUserMgmtUrl: taUserMgmtUrl })
			}
		})
	}

	render() {
		if (this.state.taUserMgmtUrl == null) {
			return null
		}
		return (
			<div className="ta-page-wrapper">
				<AppHeader activeMenu="tausermgmt" />
				<div className="ta-iframe-wrapper">
					<iframe src={this.state.taUserMgmtUrl}></iframe>
				</div>
				<AppFooter />
			</div>
		);
	}
}


LoadingMask.maskAll();
new InterceptorLoader([
	InterceptorNames.I18n,
]).handle(function () {
	LoadingMask.unmaskAll();
	ReactDOM.render(
		<App />
		, document.getElementById('main')
	);
})