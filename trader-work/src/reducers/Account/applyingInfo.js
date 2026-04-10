import { handleActions } from 'redux-actions'
import {
    APPLYING_GET_FIELDS_AND_INFO,
} from '@/actions/Account/applyingInfo'

export const fieldsData = handleActions({
    [APPLYING_GET_FIELDS_AND_INFO]: (state, { payload }) => payload
}, {})