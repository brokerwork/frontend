import { handleActions } from 'redux-actions';
import { i18n } from 'utils/i18n';

import {
  MODIFY_PARAMS,
  GET_MESSAGE_TEMPLATES,
  SET_CURRENT_TEMPLATE
} from './actions';

import { MESSAGE_TYPE } from '../../../constant';

import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';

//模板列表
export const messageTemplates = handleActions(
  {
    [GET_MESSAGE_TEMPLATES]: (state, { payload }) => payload
  },
  []
);

//模板类型
export const messageType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      return MESSAGE_TYPE.concat().filter(type => payload[type.right]);
    }
  },
  []
);

//搜索参数
export const params = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload,
    [GET_MESSAGE_TEMPLATES]: (state, { payload }) => ({
      ...state,
      loading: false
    })
  },
  { loading: true }
);

//当前操作对象
export const currentTemplate = handleActions(
  {
    [SET_CURRENT_TEMPLATE]: (state, { payload }) => {
      return payload || {};
    }
  },
  null
);
