import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_ACCOUNT_FIELDS,
  GET_ACCOUNT_PROFILE,
  CHANGE_FIELD,
  CHANGE_FIELD_DATA,
  SET_ERROR,
  CLEAR_ERROR
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const accountFields = handleActions(
  {
    [GET_ACCOUNT_FIELDS]: (state, { payload }) => payload
  },
  []
);

export const errorMap = handleActions(
  {
    [SET_ERROR]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [CLEAR_ERROR]: (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  {}
);

export const accountProfile = handleActions(
  {
    [GET_ACCOUNT_PROFILE]: (state, { payload }) => ({
      ...state,
      loading: false,
      profile: payload
    }),
    [CHANGE_FIELD]: (state, { payload }) => ({
      loading: false,
      profile: { ...state.profile, ...payload }
    }),
    [CHANGE_FIELD_DATA]: (state, { payload }) => ({
      loading: false,
      profile: { ...state.profile, ...payload }
    })
  },
  {
    loading: true,
    profile: {}
  }
);
