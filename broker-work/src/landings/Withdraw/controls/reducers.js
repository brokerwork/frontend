import { handleActions } from 'redux-actions';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';

const pageSizeKey = 'customer_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

import {
  GET_REBATE_ACCOUNT,
  GET_APPLICATIONS,
  UPDATE_PAGENATION_INFO,
  GET_WITHDRAW_CONFIG,
  GET_BANK_LIST,
  GET_DEFAULT_VALUES,
  GET_CUSTOM_FORM_FIELDS,
  GET_MAX_WITHDRAW,
  FETCH_WITHDRAWTYPE_FIELDS,
  FETCH_WITHDRAW_LIST
} from './actions';

import { BANK_INFO_FIELD_KEYS } from '../contants';

//返佣账户信息
export const rebateAccount = handleActions(
  {
    [GET_REBATE_ACCOUNT]: (state, { type, payload }) => payload
  },
  {}
);

//出金申请列表
export const applications = handleActions(
  {
    [GET_APPLICATIONS]: (state, { type, payload }) => payload.list
  },
  []
);

//列表参数
const defaultParams = {
  pageNo: 1,
  pageSize: getPageSize(),
  total: 0
};

export const params = handleActions(
  {
    [UPDATE_PAGENATION_INFO]: (state, { type, payload }) => {
      return Object.assign({}, state, payload);
    },
    [GET_APPLICATIONS]: (state, { type, payload }) => {
      return {
        pageNo: payload.pager,
        pageSize: payload.size,
        total: payload.total
      };
    }
  },
  defaultParams
);

export const withDrawConfig = handleActions(
  {
    [GET_WITHDRAW_CONFIG]: (state, { type, payload }) => payload
  },
  null
);

export const bankList = handleActions(
  {
    [GET_BANK_LIST]: (state, { type, payload }) => {
      return payload.map(({ label, value }) => {
        return {
          label,
          value: label,
          id: value
        };
      });
    }
  },
  []
);

export const defaultValues = handleActions(
  {
    [GET_DEFAULT_VALUES]: (state, { type, payload }) => {
      return BANK_INFO_FIELD_KEYS.reduce((obj, key) => {
        obj[key] = payload[key];
        return obj;
      }, {});
    }
  },
  {}
);

export const customFormFields = handleActions(
  {
    [FETCH_WITHDRAWTYPE_FIELDS]: (state, { type, payload }) => payload
  },
  []
);
export const maxWidthdraw = handleActions(
  {
    [GET_MAX_WITHDRAW]: (state, { payload }) => payload
  },
  {}
);
export const enableWithdrawList = handleActions(
  {
    [FETCH_WITHDRAW_LIST]: (state, { payload }) => payload
  },
  null
);
