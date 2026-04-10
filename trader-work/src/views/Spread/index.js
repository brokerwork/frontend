import { Route, Switch } from 'react-router-dom'
import { injectReducer } from 'utils/injectReducer'

import RecommendDetail from './recommendDetail'
import AgencyDetail from './agencyDetail'
import reducers from '@/reducers/Spread'
import CommissionReport from './commissionReport'

injectReducer('spread', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/recommendDetail`} component={RecommendDetail}></Route>
			<Route path={`${props.match.url}/agencyDetail`} component={AgencyDetail}></Route>
			<Route path={`${props.match.url}/commissionreport`} component={CommissionReport}></Route>
		</Switch>
	)
}
