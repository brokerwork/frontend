import { Route, Switch } from 'react-router-dom'
import { injectReducer } from 'utils/injectReducer'

import OpenAccount from './openAccount'
import OpenRealAccount from './openRealAccount'
import OpenSameAccount from './openSameAccount'
import OpenMockAccount from './openMockAccount'
import ApplyingInfo from './applyingInfo'
import BindAccount from './bindAccount'
import openActTest from './openActTest'
import AdjustLever from './adjustLever'
import ModifyPwd from './modifyPwd'// 该文件暂时废弃的
import ForgotPwd from './forgotPwd'// 该文件暂时废弃的
import TransactionReports from './transactionReports'
import reducers from '@/reducers/Account'

injectReducer('account', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/adjustLever`} component={AdjustLever}></Route>
			<Route path={`${props.match.url}/open/real/:vendor`} component={OpenRealAccount}></Route>
			<Route path={`${props.match.url}/open/same/:vendor`} component={OpenSameAccount}></Route>
			<Route path={`${props.match.url}/open/mock/:vendor`} component={OpenMockAccount}></Route>
			<Route path={`${props.match.url}/open/applying/live/:vendor`} component={ApplyingInfo}></Route>
			<Route path={`${props.match.url}/open/applying/same/:vendor`} component={ApplyingInfo}></Route>
			<Route path={`${props.match.url}/open/bind/:vendor`} component={BindAccount}></Route>
			<Route path={`${props.match.url}/open/acttest/:redirect?`} component={openActTest}></Route>
			<Route path={`${props.match.url}/modifypwd`} component={ModifyPwd}></Route>
			<Route path={`${props.match.url}/forgotpwd`} component={ForgotPwd}></Route>
			<Route path={`${props.match.url}/transactionReports`} component={TransactionReports}></Route>
			<Route path={`${props.match.url}/open`} component={OpenAccount}></Route>
		</Switch>
	)
}
