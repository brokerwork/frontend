import { handleActions } from 'redux-actions'
import {
    OVERVIEW_GET_PLATFORM_LIST,
    OVERVIEW_GET_POINTS
} from '@/actions/Personal/overview'

export const platformList = handleActions({
    [OVERVIEW_GET_PLATFORM_LIST]: (state, { payload }) => payload
}, [])
export const pointsMap = handleActions({
    [OVERVIEW_GET_POINTS]: (state, { payload }) => {
        const obj = {}
        payload.forEach(el=>{
            if(el.key.indexOf('points')!==-1&&el.enable){
                obj[el.key] = {
                    label: el.label,
                    orderNo: el.orderNo
                }
            }
        })
        return obj
    }
}, {})


