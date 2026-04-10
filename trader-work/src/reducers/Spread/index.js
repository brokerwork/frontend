import { combineReducers } from 'redux'
import * as recommendDetail from './recommendDetail'
import * as commissionReport from './commissionReport'

export default combineReducers({
    ...recommendDetail,
    ...commissionReport,
})