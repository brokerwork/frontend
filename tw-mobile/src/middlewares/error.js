import { msgDialog } from '../common/commonActions'
import i18n from '../utils/i18n'
import wxUtils from '../utils/wxUtils'

export default function errorMiddleware({ dispatch }) {
  return next => action => {
    const { error, payload, ...otherField } = action
    if (error) {
      if (payload instanceof Error) {
        dispatch(msgDialog(payload.message))
      } else if (payload && payload.result === false) {
        dispatch(msgDialog(i18n.mcode(payload.mcode)))
        if(window.location.href.indexOf('fromApp') != -1) return false
        if (payload.mcode == 'PUB_AUTH_0000018' || payload.mcode == 'TA_AUTH_0000003') {
          if (wxUtils.isWechat()) { 
            window.location.href = wxUtils.getPreSignupURL()
          }
          setTimeout(() => { window.location.href = '/' }, 500)
        }
      }
    } else {
      return next(action)
    }
  }
}
