import { combineReducers } from 'redux'
import * as vod from './vod'
import * as live from './live'

export default combineReducers({
    ...live,
    ...vod,
})