import { isFSA  } from 'flux-standard-action';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware( { dispatch } ) {
  return function (next) {
    return function (action) {
      if (action.meta && action.meta.skipReducer){
        return action.payload;
      }
      if (!isFSA(action)) {
        return isPromise(action) ? action.then(dispatch) : next(action);
      }
      return isPromise(action.payload) ? action.payload.then(function (res) {
        if (res.result) {
          return dispatch(Object.assign({}, action, { payload: res }))
        } else { 
          return dispatch(Object.assign({}, action, { payload: res, error: true }))
        }
      }, function (error) {
        return dispatch(Object.assign({}, action, { payload: error, error: true }))
      }) : next(action);
    };
  };
}