import { Route, Switch } from 'react-router-dom'
import { injectReducer } from 'utils/injectReducer'

import Telegraphic from './telegraphic'
import Transfer from './transfer'
import Withdraw from './withdraw'
import Deposit from './deposit'
import TradingFlow from './tradingFlow'
import Task from './task'

import reducers from '@/reducers/Fund'
injectReducer('fund', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/telegraphic`} component={Telegraphic}></Route>
			<Route path={`${props.match.url}/deposit`} component={Deposit}></Route>
			<Route path={`${props.match.url}/transfer`} component={Transfer}></Route>
			<Route path={`${props.match.url}/withdraw`} component={Withdraw}></Route>
			<Route path={`${props.match.url}/tradingFlow`} component={TradingFlow}></Route>
			<Route path={`${props.match.url}/task`} component={Task}></Route>
		</Switch>
	)
}
