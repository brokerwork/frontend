import { Route, Switch } from 'react-router-dom'
import Artificial from './artificial'
import Robot from './robot'

import { injectReducer } from 'utils/injectReducer'
import reducers from '@/reducers/Viewpoint'

injectReducer('viewpoint', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/artificial`} component={Artificial} exact></Route>
			<Route path={`${props.match.url}/robot`} component={Robot} exact></Route>
		</Switch>
	)
}
