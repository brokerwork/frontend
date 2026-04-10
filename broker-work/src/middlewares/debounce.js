export default function debounceMiddleware({ dispatch, getState }) {
  return next => action => {
    const { payload = {} } = action;
    if (!payload.__debounce) {
      return next(action);
    }
  };
}
