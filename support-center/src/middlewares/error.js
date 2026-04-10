import { showTopAlert } from 'common/actions';
import i18n from 'utils/i18n';

export default function errorMiddleware({ dispatch }) {
  return next => (action) => {
    const { error, mcode } = action;
    // 登陆超时跳转登陆页
    if (mcode === 'PUB_AUTH_0000018') {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
    // 需要排除 redux-form 的错误码
    if (error && !action.type.includes('redux-form/')) {
      if (action.payload instanceof Error) {
        throw new Error(action.payload);
      } else if(mcode==='OW_TENANT_00063'&&action.type==='BROKER_FIELD_SETTING_DISABLE_FIELD'){//特殊处理，禁用字段不提示
        return;
      }else{
        dispatch(showTopAlert({
          content: i18n.mcode(action.payload)
        }));
      }
      // 当有错误信息时.则错误的action不再往外发送.
    } else {
      return next(action);
    }
  };
}
