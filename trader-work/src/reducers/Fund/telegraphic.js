import { handleActions } from 'redux-actions'
import {
    BIND_GET_SERVER_LIST,
} from '@/actions/Account/bindAccount'
import {
    TELEGRAPHIC_GET_VA,
} from '@/actions/Fund/telegraphic'

export const serverList = handleActions({
    [BIND_GET_SERVER_LIST]: (state, { payload }) => payload
}, [])

export const vaInfo = handleActions({
    [TELEGRAPHIC_GET_VA]: (state, { payload }) => payload
}, {
    // name: '陈俊良',
    // bank: '建设银行成都分行',
    // account: '353254663',
    // currency: 'USD',
    // description: '我这个数据是模拟的'
})
