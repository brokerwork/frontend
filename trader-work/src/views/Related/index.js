import { Route, Switch } from 'react-router-dom'
import Link from './link'

import { injectReducer } from 'utils/injectReducer'
import reducers from '@/reducers/Related'

injectReducer('related', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/link`} component={Link} exact></Route>
		</Switch>
	)
}
