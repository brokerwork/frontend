import { handleActions } from 'redux-actions'
import {
    OPENREAL_FIELDS_INFO,
    OPENREAL_STEP_SUBMIT,
} from '@/actions/Account/openRealAccount'

export const fields = handleActions({
    [OPENREAL_FIELDS_INFO]: (state, { payload }) => payload,
    [OPENREAL_STEP_SUBMIT]: (state, { payload }) => { 
        if (payload.data) {
            state.fields.find(el=>el.index==payload.step).fieldList.forEach(f => {
				f.defaultValue = payload.data[`${f.formName}@${f.key}`]
			})
        }
        return state
    },
}, null)