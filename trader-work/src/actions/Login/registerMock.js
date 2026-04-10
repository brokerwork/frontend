import { createAction } from 'redux-actions'

import api from '@/api'

export const REGISTERMOCK = 'REGISTERMOCK'

export const USERNAMECHANGE = 'USERNAMECHANGE'
export const EMAILCHANGE = 'EMAILCHANGE'
export const MOBILECHANGE = 'MOBILECHANGE'
export const PASSWORDCHANGE = 'PASSWORDCHANGE'
export const CODECHANGE = 'CODECHANGE'
export const FETCHNATIONS = 'FETCHNATIONS'
export const registerMock = createAction(
    REGISTERMOCK,
    data => api.post('/v2/user/demo/signupopen', data)
)
export const fetchNations = createAction(
    FETCHNATIONS,
    data => api.get('/v1/ops/tenants/nation')
)

export const changeUserName =(value)=>{
  return {
    type: USERNAMECHANGE,
    payload: value
  }
}
export const changeEmail =(value)=>{
  return {
    type: EMAILCHANGE,
    payload: value
  }
}
export const changeMobile =(value)=>{
  return {
    type: MOBILECHANGE,
    payload: value
  }
}
export const changePassword =(value)=>{
  return {
    type: PASSWORDCHANGE,
    payload: value
  }
}
export const changeCode =(value)=>{
  return {
    type: CODECHANGE,
    payload: value
  }
}