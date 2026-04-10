import { handleActions } from 'redux-actions';
import {
  GET_REAL_TIME_STATUS,
  ENABLE_REAL_TIME,
  DISABLE_REAL_TIME
} from './actions';

export const realTimeStatus = handleActions(
  {
    [GET_REAL_TIME_STATUS]: (state, { type, payload }) => payload,
    [ENABLE_REAL_TIME]: (state, { type, payload }) => {
      return {
        ...state,
        ...payload
      };
    },
    [DISABLE_REAL_TIME]: (state, { type, payload }) => {
      return {
        ...state,
        ...payload
      };
    }
  },
  {}
);
