import { handleActions } from 'redux-actions'

import { LINK_GET } from '@/actions/Related/link'

export const links = handleActions({
    [LINK_GET]: (state, {payload}) => {
        return payload
    }
}, [])