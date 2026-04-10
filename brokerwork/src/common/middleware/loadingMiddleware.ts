import { LoadingMask } from 'fooui';

// 计时器
let timer:number = -1;
// 计数器，用于并发请求时，合并loading mask.
let maskCount:number = 0;
// 延迟时间 300ms以内，用户不会感觉到延迟.
const delayTime:number = 150;

function mask() {
  if (timer > 0 && maskCount > 0) {
    clearTimeout(timer);
    timer = -1;
  }
  // 延迟打开loading mask
  // 如果请求时间很短(<= delayTime)，则不打开loading mask.
  timer = setTimeout(() => {
    if (++maskCount > 1) return;
    LoadingMask.maskAll();
    timer = -1;
  }, delayTime);
}
function unmask() {
  if (timer > 0) {
    clearTimeout(timer);
    timer = -1;
  }
  // 延迟关闭loading mask,
  // 如果两次请求的时间间隔很短，则合并两个请求的loading mask.
  if(--maskCount > 0) return;
  timer = setTimeout(() => {
    LoadingMask.unmaskAll();
    timer = -1;
  }, delayTime);
}

export default function loadingMiddleware({ dispatch }) {
  return (next: Function) => (action: Object) => {
    const {payload, meta} = action;
    if(isPromise(payload) && !(meta && meta.noMask)) {
      mask();
      payload.then(
        result => unmask(),
        error => unmask()
      )
    }
    return next(action);
  };
}

function isPromise(val) {
  return val && typeof val.then === 'function';
}