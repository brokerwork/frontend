import { createAction } from 'redux-actions'

import { get, post } from 'utils/api'
import { Storage } from 'utils/storage'

export const TELEGRAPHIC_TRANSFER_DEPOSIT = 'TELEGRAPHIC_TRANSFER_DEPOSIT'

export const telegraphicDeposit = createAction(
    TELEGRAPHIC_TRANSFER_DEPOSIT,
    (data) => { 
        let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
        return post('/api/v1/fund/telegraphic/transfer/deposit', {
            headers: {
                'x-api-account-token': accountToken,
            },
            data: {
                "depositRequest": {
                    "comment": data.comment,    // 评论
                    "currency": data.currency,  // 存款货币
                    "depositAmount": data.depositAmount, // 存款金额
                    "payAmount": data.payAmount,  // 实际支付金额
                    "telegraphicTransferUrl": data.url, // 电汇入金凭证Url
                },
                "q": Date.now() // 随机数
            }
        })
    }
)