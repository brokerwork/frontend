import { combineReducers } from 'redux'
import * as overview from './overview'
import * as notices from './notices'
import * as appropriateTest from './appropriateTest'
import * as accountInfo from './accountInfo'
import * as userInfo from './userInfo'

export default combineReducers({
    ...overview,
    ...notices,
    ...appropriateTest,
    ...accountInfo,
    ...userInfo,
})