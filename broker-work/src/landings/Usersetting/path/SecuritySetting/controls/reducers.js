import { handleActions } from 'redux-actions';
import { GET_SETTING, GET_GOOGLE_INFO, GET_AUTH_STATE } from './actions';

export const settingDetail = handleActions(
  {
    [GET_SETTING]: (state, { type, payload = {} }) => {
      return payload;
    }
  },
  {}
);

export const googleInfo = handleActions(
  {
    [GET_GOOGLE_INFO]: (state, { type, payload = {} }) => {
      return payload;
    }
  },
  {}
);

export const authState = handleActions(
  {
    [GET_AUTH_STATE]: (state, { type, payload = false }) => {
      return payload;
    }
  },
  false
);

