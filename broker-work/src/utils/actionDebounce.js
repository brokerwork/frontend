// action 防重放
// 防止action在短时间内无意义多次重复发起
export default function actionDebounce(fn, time = 1000) {
  let t = 0; // 请求时间记录
  let res = {}; // 返回值记录
  return function() {
    const n = Date.now();
    if (n - t > time) {
      t = n;
      res = fn(...arguments);
      res.__debounce = false;
    } else {
      res.__debounce = true;
    }
    return res;
  };
}
