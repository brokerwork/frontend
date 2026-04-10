import { handleActions } from 'redux-actions';
import {
  GET_FORM_FIELDS,
  GET_AGENT_CONFIG,
  GET_BRAND_INFO,
  GET_UPLOAD_SIGN_TOKEN
} from './actions';

export const formFields = handleActions(
  {
    [GET_FORM_FIELDS]: (state, { type, payload }) => payload
  },
  {
    baseInfo: [],
    idInfo: []
  }
);

export const agentConfig = handleActions(
  {
    [GET_AGENT_CONFIG]: (state, { type, payload }) => payload
  },
  {}
);

export const brandInfo = handleActions(
  {
    [GET_BRAND_INFO]: (state, { type, payload }) => payload
  },
  {}
);

export const uploadToken = handleActions(
  {
    [GET_UPLOAD_SIGN_TOKEN]: (state, { type, payload }) => payload
  },
  ''
);
