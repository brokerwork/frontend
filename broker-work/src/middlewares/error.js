import { showTopAlert } from 'commonActions/actions';
import i18n from 'utils/i18n';
import { logoutSessionStorage } from 'utils/sessionStorageShare';

export default function errorMiddleware({ dispatch }) {
  return next => action => {
    const { error, ...otherField } = action;
    // 需要排除 redux-form 的错误码
    if (error && !action.type.includes('redux-form/')) {
      if (action.payload instanceof Error) {
        throw new Error(action.payload);
      } else {
        if (action.payload) {
          dispatch(
            showTopAlert({
              content: i18n.mcode(action.payload)
            })
          );
        }
        // PUB_AUTH_0000018 token 过期
        // PUB_AUTH_0000029 token 为空
        if (
          action.payload === 'PUB_AUTH_0000018' ||
          action.payload === 'PUB_AUTH_0000029'
        ) {
          setTimeout(() => {
            window.sessionStorage.clear();
            // 清除其他浏览器标签页的sessionStorage
            logoutSessionStorage();

            window.location.href = '/';
          }, 2000);
        }
      }
      const { meta: { fallback } = {} } = action;
      if (typeof fallback !== 'undefined') {
        return next({
          ...action,
          payload: fallback
        });
      }
      // 当有错误信息时.则错误的action不再往外发送.
      // 当action的meta中有fallback时, 错误的action以fallback作为payload的值继续往外发送.
    } else {
      return next(action);
    }
  };
}
