import { handleActions } from 'redux-actions'
import { REGISTERREAL_FETCHITEMS } from '@/actions/Login/registerReal'

const registerRealResult = handleActions({
    
    [REGISTERREAL_FETCHITEMS]: (state, { type, payload }) => {
      return {...state, fields: payload}
    }
    
    
}, {fields: {}})

export default registerRealResult