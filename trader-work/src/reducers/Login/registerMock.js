import { handleActions } from 'redux-actions'
import { REGISTERMOCK, USERNAMECHANGE, EMAILCHANGE, MOBILECHANGE, PASSWORDCHANGE, CODECHANGE, FETCHNATIONS } from '@/actions/Login/registerMock'

const registerMockResult = handleActions({
    [REGISTERMOCK]: (state, { type, payload }) => {
      let newState = Object.assign({},state,{
        registerSuccess: payload
      })
      
      return newState
    },
    [USERNAMECHANGE]: (state, { type, payload }) => {
      return {...state, userName: payload}
    },
    [EMAILCHANGE]: (state, { type, payload }) => {
      return {...state, email: payload}
    },
    [MOBILECHANGE]: (state, { type, payload }) => {
      return {...state, mobile: payload}
    },
    [PASSWORDCHANGE]: (state, { type, payload }) => {
      return {...state, password: payload}
    },
    [CODECHANGE]: (state, { type, payload }) => {
      return {...state, recode: payload}
    },
    [FETCHNATIONS]: (state,{ type, payload })=>{
      let newState = Object.assign({},state,{
        nations: payload
      })
      
      return newState
    }
}, {})

export default registerMockResult