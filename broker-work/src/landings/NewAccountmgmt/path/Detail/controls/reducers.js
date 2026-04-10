import { handleActions } from 'redux-actions';
import {
  GET_TRADE_LIST,
  SET_ACCOUNT_ID,
  GET_ACCOUNT_DETAIL,
  CHECK_OWNER_INFO_DIFF,
  GET_APPROPRIATENESS_TEST_STATUS,
  GLOBAL_FORM_CHANGE,
  GLOBAL_FORM_FAILED,
  GLOBAL_FORM_EMPTY,
  GLOBAL_FORM_SUBMIT,
  GET_BANK_LISTS,
  GET_BIND_BANK,
  GET_MAX_WITHDRAW,
  GET_FORM_FIELDS,
  GET_OS_CONFIG,
  GET_WITHDRAW_LIST,
  GET_RELATE_ACCOUNT_LIST
} from './actions';

export const accountId = handleActions(
  {
    [SET_ACCOUNT_ID]: (state, { payload }) => payload
  },
  ''
);

export const tradeList = handleActions(
  {
    [GET_TRADE_LIST]: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    }
  },
  {
    balance: [],
    position: [],
    deal: [],
    order: []
  }
);

export const accountInfo = handleActions(
  {
    [GET_ACCOUNT_DETAIL]: (state, { payload }) => {
      let { accountInfo } = payload;
      if (accountInfo.leverage) {
        accountInfo.leverage = `${accountInfo.leverage}`;
      }
      return accountInfo;
    }
  },
  {}
);

export const ownerInfo = handleActions(
  {
    [GET_ACCOUNT_DETAIL]: (state, { payload }) => ({
      ...payload.accountOwner,
      customerInfo: payload.customerInfo
    })
  },
  {}
);

export const ownerRelatedInfo = handleActions(
  {
    [GET_ACCOUNT_DETAIL]: (state, { payload }) => ({
      customer: {
        value: payload.customerId,
        label: payload.customerName
      },
      accountId: payload.relatedAccountId || []
    })
  },
  {
    customer: {},
    accountId: []
  }
);

export const diffOwnerInfo = handleActions(
  {
    [CHECK_OWNER_INFO_DIFF]: (state, { payload }) => payload
  },
  {}
);

export const taUserInfo = handleActions(
  {
    [GET_ACCOUNT_DETAIL]: (state, { payload }) => payload.taUser || {}
  },
  {}
);

export const appropriatenessTestStatus = handleActions(
  {
    [GET_APPROPRIATENESS_TEST_STATUS]: (status, { payload }) => payload
  },
  false
);

export const changedFormArray = handleActions(
  {
    [GLOBAL_FORM_CHANGE]: (state, { payload }) => {
      if (state.includes(payload)) {
        return state;
      } else {
        return [...state, payload];
      }
    },
    [GLOBAL_FORM_EMPTY]: () => []
  },
  []
);

export const failedFormArray = handleActions(
  {
    [GLOBAL_FORM_FAILED]: (state, { payload }) => {
      if (state.includes(payload)) {
        return state;
      } else {
        return [...state, payload];
      }
    },
    [GLOBAL_FORM_EMPTY]: () => []
  },
  []
);

export const bankLists = handleActions(
  {
    [GET_BANK_LISTS]: (state, { payload }) => payload
  },
  []
);
export const bindBank = handleActions(
  {
    [GET_BIND_BANK]: (state, { payload }) => payload
  },
  {}
);
export const maxWidthdraw = handleActions(
  {
    [GET_MAX_WITHDRAW]: (state, { payload }) => payload
  },
  {}
);
export const formFields = handleActions(
  {
    [GET_FORM_FIELDS]: (state, { payload }) => payload
  },
  []
);
export const osConfig = handleActions(
  {
    [GET_OS_CONFIG]: (state, { payload }) => payload
  },
  []
);
export const withdrawList = handleActions(
  {
    [GET_WITHDRAW_LIST]: (state, { payload }) => payload
  },
  []
);
export const relateAccountList = handleActions(
  {
    [GET_RELATE_ACCOUNT_LIST]: (state, { payload }) => payload || []
  },
  []
);
export const isBlackUser = handleActions(
  {
    [GET_ACCOUNT_DETAIL]: (state, { payload }) => payload.isBlackUser
  },
  false
);
