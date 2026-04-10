import { isFSA } from 'flux-standard-action';
import i18n from 'utils/i18n';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    const promise = action.payload;
    if (!isPromise(promise)) return next(action);

    promise.then(res => {
      if (res.result) {
        return next({ ...action, payload: res.data });
      } else {
        return next({ ...action, payload: i18n.mcode(res.mcode), error: true, mcode: res.mcode });
      }
    });

    return promise;
  };
}
