import { handleActions } from 'redux-actions'
import { CHANGEMOBILE, RESETPWD } from '@/actions/Login/forgetPwd'

const forgetPwdResult = handleActions({
    [CHANGEMOBILE]: (state, { type, payload }) => {
      let newState = Object.assign({},state,{mobile: payload.value})
      return newState
    }
}, {})

export default forgetPwdResult