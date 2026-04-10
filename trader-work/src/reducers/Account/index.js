import { combineReducers } from 'redux'
import * as bindAccount from './bindAccount'
import * as transactionReports from './transactionReports'
import * as forgotPwd from './forgotPwd'
import * as openActTest from './openActTest'
import * as openRealAccount from './openRealAccount'
import * as openSameAccount from './openSameAccount'
import * as openAccount from './openAccount'
import * as applyingInfo from './applyingInfo'
import * as adjustLever from './adjustLever'

export default combineReducers({
    ...bindAccount,
    ...transactionReports,
    ...forgotPwd,
    ...openActTest,
    ...openRealAccount,
    ...openSameAccount,
    ...openAccount,
    ...applyingInfo,
    ...adjustLever
})