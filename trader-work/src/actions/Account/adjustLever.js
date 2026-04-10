import api from '@/api'
import { createAction } from 'redux-actions'
import { ACCOUNT_TOKEN, ACCOUNT_DATA, ls} from '@/utils/storage'
import { APP_ACCOUNT_TO_STATE, getAccountList, loadAccount2state } from '@/actions/App/app'
export const LEVER_ADJUST = 'LEVER_ADJUST'
export const LEVER_UPDATABLE = 'LEVER_UPDATABLE'

// 申请调整杠杆
export const adjustLever = createAction(
    LEVER_ADJUST,
  (params, accountId) => dispatch => { 
      return dispatch({
        type: LEVER_ADJUST,
        payload: api.post('/v1/account/leverage', {
            currentLeverage: params.currentLeverage,
            expectedLeverage: params.expectedLeverage,
            comment: params.comment,
        }).then(res => { 
            if (res && res.result) { 
                //  调整杠杆后 更新账户列表及当前账户信息
                dispatch({
                    type: APP_ACCOUNT_TO_STATE,
                    payload: api.get('/v1/accounts').then(response => { 
                        if (response && response.result && response.data) { 
                            let account = response.data.tradeAccounts.filter(item => item.account == accountId)
                            ls.setItem(ACCOUNT_DATA, { accountToken: ls.getItem(ACCOUNT_TOKEN), currAccount: account ? account[0] : '' })
                            dispatch(loadAccount2state())
                            dispatch(getAccountList())
                        }
                        return Promise.resolve(response)
                    })
                })
            }
            return Promise.resolve(res)
        })
      })
  }
)
// 获取调整杠杆信息
export const getLever = createAction(
  LEVER_UPDATABLE,
  () => {
    return api.get('/v1/account/leverage/updatable')
  }
)

