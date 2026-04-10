import { Message } from 'fooui';
import {I18nLoader} from '../../i18n/loader';

export default function errorMiddleware({ dispatch }) {
  return next => action => {
    const {error, payload} = action;
    return error
      ? Message.error(I18nLoader.getErrorText(payload))
      : next(action);
  };
}

