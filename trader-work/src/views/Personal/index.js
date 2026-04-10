import { Route, Switch } from 'react-router-dom'
import Overview from './overview'
import NoticeList from './notices'
import NoticeDetail from './noticeDetail'

import AppropriateTest from './appropriateTest'
import Test1 from './test1'
import AccountInfo from './accountInfo'
import UserInfo from './userInfo'
import { injectReducer } from 'utils/injectReducer'
import reducers from '@/reducers/Personal'

injectReducer('personal', reducers)

export default ({ history, ...props }) => {
	return (
		<Switch>
			<Route path={`${props.match.url}/overview`} component={Overview}></Route>
			<Route path={`${props.match.url}/test1/:cnt`} component={Test1}></Route>
			<Route exact path={`${props.match.url}/noticeList`} component={NoticeList}></Route>
			<Route path={`${props.match.url}/noticeList/:id`} component={NoticeDetail}></Route>
			<Route path={`${props.match.url}/test`} component={AppropriateTest}></Route>
			<Route path={`${props.match.url}/accountInfo`} component={AccountInfo}></Route>
			<Route path={`${props.match.url}/userInfo`} component={UserInfo}></Route>
		</Switch> 
	)
}
