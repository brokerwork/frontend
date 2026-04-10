import { Route, Switch } from 'react-router-dom'
import Live from './live'
import Vod from './vod'
import Webcast from './webcast'
import VodList from './vodList'

import { injectReducer } from 'utils/injectReducer'
import reducers from '@/reducers/Training'

injectReducer('training', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/live`} component={Live} exact></Route>
			<Route path={`${props.match.url}/live/:videoId`} component={Webcast}></Route>
			<Route path={`${props.match.url}/vod`} component={Vod} exact></Route>
			<Route path={`${props.match.url}/vod/:videoId`} component={VodList}></Route>
		</Switch>
	)
}
