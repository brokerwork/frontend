import { combineReducers } from 'redux'
import * as telegraphic from './telegraphic'
import * as transfer  from './transfer'
import * as withdraw from './withdraw'
import * as task from './task'
import * as tradingFlow from './tradingFlow';

export default combineReducers({
    ...telegraphic,
    ...transfer,
    ...withdraw,
    ...task,
    ...tradingFlow
})