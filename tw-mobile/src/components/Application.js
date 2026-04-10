import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
// theme
import defaultTheme from 'themes/index'
// page
import { PageWrapper } from '../widgets/PageWrapper';
import Accounts from '../pages/Accounts';
import Settings from '../pages/BindingInfo/containers/settings';
import Login from '../pages/Login';
import Entrance from '../pages/Entrance';
import SignupOpenAccount from '../pages/SignupOpenAccount/index';
import BindAccount from '../pages/BindAccount'
import OpenMockAccount from '../pages/OpenMockAccount';
import OpenMockAccountSuccess from '../pages/OpenMockAcctSuccess';
import OpenRealAccount from '../pages/OpenRealAccount';
import OpenRealAcctSuccess from '../pages/OpenRealAcctSuccess';
import OpenAcctStep from '../pages/OpenAcctStep'
import OpenAcctList from '../pages/OpenAcctStep/components/submitFields'
import AccountSinglePage from '../pages/AccountSinglePage';
import Deposit from '../pages/Deposit';
import Telegraphic from '../pages/Telegraphic'
import Leverage from '../pages/Leverage'
import TradeReports from '../pages/TradeReports'
import PersonalInfoPage from '../pages/Personal';
import Fundflow from '../pages/Fundflow';
import Withdraw from '../pages/Withdraw';
import LiveBroadCast from '../pages/LiveBroadCast';
import LiveSinglePage from '../pages/LiveSinglePage';
import AlbumPage from '../pages/AlbumPage';
import VideoSinglePage from '../pages/VideoSinglePage';
import Redirect from '../redirect';
import * as commonActions from 'common/commonActions';
import { isFullUrl } from '../utils/urlUtils'

class App extends Component {
	componentWillMount() {
		let { fetchBrandInfo, setAppReady, checkLanguageVersion } = this.props;
		Promise.all([
			fetchBrandInfo(),
			checkLanguageVersion()
		]).then(() => {
			setAppReady(true);
		});
	}
	render() {
		let { isApplicationReady, history } = this.props;
		if (!isApplicationReady) return null;
		return (
			<IntlProvider locale="en">
				<MuiThemeProvider muiTheme={defaultTheme}>
					<Router history={history}>
						<Route path="/" component={Redirect}>
							<Route path="/entrance" component={Entrance}></Route>
							<Route path="/login" component={Login}></Route>
							<Route path="/accounts" component={Accounts}></Route>
							<Route path="/signupopen" component={SignupOpenAccount}></Route>
							<Route path="/personal" component={PersonalInfoPage}></Route>
							<Route path="/accounts/bindAccount/:vendor" component={BindAccount}></Route>
							<Route path="/accounts/open/mock" component={OpenMockAccount}></Route>
							<Route path="/accounts/open/mock/success" component={OpenMockAccountSuccess}></Route>
							<Route path="/accounts/open/real/success" component={OpenRealAcctSuccess}></Route>
							<Route path="/accounts/open/real(/:isAppendAccount)" component={OpenRealAccount}></Route>
							<Route path="/accounts/openAcct/:vendor" component={OpenAcctStep}></Route>
							<Route path="/accounts/OpenAcctList(/:vendor)/:id" component={OpenAcctList}></Route>
							<Route path="/accounts/singlepage" component={AccountSinglePage}></Route>
							<Route path="/accounts/singlepage/deposit" component={Deposit}></Route>
							<Route path="/accounts/singlepage/telegraphic" component={Telegraphic}></Route>
							<Route path="/accounts/singlepage/withdraw" component={Withdraw}></Route>
							<Route path="/accounts/singlepage/leverage" component={Leverage}></Route>
							<Route path="/accounts/singlepage/tradeReports" component={TradeReports}></Route>
							<Route path="/accounts/singlepage/fundflow" component={Fundflow}></Route>
							<Route path="/livebroadcast" component={LiveBroadCast}></Route>
							<Route path="/livebroadcast/:id" component={LiveSinglePage}></Route>
							<Route path="/albumpage/:id" component={AlbumPage}></Route>
							<Route path="/albumpage/:id/:index" component={VideoSinglePage}></Route>
						</Route>
					</Router>
				</MuiThemeProvider>
			</IntlProvider>
		)
	}
}

App.propTypes = {
	isApplicationReady: React.PropTypes.bool
}

let Application = connect(({ common }) => {
	return {
		isApplicationReady: common.isApplicationReady
	}
}, {
		...commonActions
})(App);

export { Application }