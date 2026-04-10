import api from '@/api'
import { createAction } from 'redux-actions'

export const MOCK_APPLY_DEMO = 'MOCK_APPLY_DEMO'

export const applyDemo = createAction(
    MOCK_APPLY_DEMO,
    (params) => { 
        return api.post('/v1/account/apply/demo', {
            accountName: params.accountName,
            demoAccountType: params.accountType,
            email: params.accountEmail,
            phone: params.accountPhone,
            vendor: params.vendor,
            ctid: !!params.ctid? params.ctid: undefined
        })
    }
)