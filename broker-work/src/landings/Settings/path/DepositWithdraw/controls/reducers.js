import { handleActions } from 'redux-actions';
import { GET_DEPOSIT_WITHDRAW_INFO, SET_PARAMS } from './actions';

export const depositWithdrawInfo = handleActions(
  {
    [GET_DEPOSIT_WITHDRAW_INFO]: (state, { payload }) => payload
  },
  {}
);

export const depositTypeList = handleActions(
  {
    [GET_DEPOSIT_WITHDRAW_INFO]: (state, { payload }) => {
      return payload.deposits;
    }
  },
  []
);

export const withdrawTypeList = handleActions(
  {
    [GET_DEPOSIT_WITHDRAW_INFO]: (state, { payload }) => {
      return payload.withdraws;
    }
  },
  []
);

export const params = handleActions(
  {
    [SET_PARAMS]: (state, { payload }) => {
      const { type, ...others } = payload;
      state[type] = { ...others };
      return { ...state };
    }
  },
  {
    withdraw: {
      showOperateTypeModal: false,
      target: null
    },
    deposit: {
      showOperateTypeModal: false,
      target: null
    }
  }
);
