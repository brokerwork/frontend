//import { showTopAlert } from '@/actions/Common/common'
import Message from '@/components/Message'
export default function errorMiddleware({
  dispatch
}) {
  return next => action => {
    const {
      error,
      ...otherField
    } = action;
    // 需要排除 redux-form 的错误码
    if (error && !action.type.includes("redux-form/")) {
      if (action.payload instanceof Error) {
        throw new Error(action.payload);
      } else {
        // dispatch(showTopAlert({
        //   content: action.payload
        // }));
        Message['error'](action.payload);
      }
      // 当有错误信息时.则错误的action不再往外发送.
    } else {
      return next(action);
    }
  };
}