import { handleActions } from 'redux-actions';
import {
  GET_SERVER_LIST,
  GET_SERVER_SYMBOLS,
  GET_ACCOUNT_LIST,
  GET_LEVEL_LIST,
  GET_BALANCE_UNIT,
  GET_BALANCE_TYPE,
  GET_GROUP_LIST,
  GET_SERVER_GROUP_LIST,
  GET_COMMISSION_TYPE,
  GET_BASIC_RESOURCE,
  GET_DEPOSIT_BASIC_RESOURCE,
  GET_DIRSTRIBUTION_BASIC_RESOURCE,
  GET_DIRSTRIBUTION_MODE2_BALANCE_TYPE,
  GET_RT_STATUS
} from './actions';
import { BALANCE_TYPE } from '../constant';

export const server_list = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const server_symbols = handleActions(
  {
    [GET_SERVER_SYMBOLS]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[6],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.serverSymbol
  },
  []
);

export const account_list = handleActions(
  {
    [GET_ACCOUNT_LIST]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[5],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.userGroup,
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[4]
  },
  []
);

export const level_list = handleActions(
  {
    [GET_LEVEL_LIST]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => {
      return payload[4];
    },
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.levelList,
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[3]
  },
  []
);

export const balance_unit = handleActions(
  {
    [GET_BALANCE_UNIT]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[3],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.balanceUnit
  },
  []
);

export const deposit_balance_unit = handleActions(
  {
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[2]
  },
  []
);

export const balance_type = handleActions(
  {
    [GET_BALANCE_TYPE]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[2],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.balanceType,
    [GET_DIRSTRIBUTION_MODE2_BALANCE_TYPE]: (state, { type, payload }) =>
      payload
  },
  BALANCE_TYPE
);

export const group_list = handleActions(
  {
    [GET_GROUP_LIST]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[1],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.symbolGroup
  },
  []
);

export const server_group_list = handleActions(
  {
    [GET_SERVER_GROUP_LIST]: (state, { type, payload }) => payload,
    [GET_BASIC_RESOURCE]: (state, { type, payload }) => payload[0],
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.serverGroup,
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[0]
  },
  []
);

export const commission_type = handleActions(
  {
    [GET_COMMISSION_TYPE]: (state, { type, payload }) => payload,
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[1]
  },
  []
);

export const profitType = handleActions(
  {
    [GET_DEPOSIT_BASIC_RESOURCE]: (state, { type, payload }) => payload[5]
  },
  []
);

export const cycleLevelList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.cycleLevel
  },
  []
);

export const parentSubRelationList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.parentSubRelation
  },
  []
);

export const distributionCommissionTypeList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.distributionCommissionType
  },
  []
);

export const distributionPipCommissionTypeList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.distributionPipCommissionType
  },
  []
);

export const distributionIndiCommissionTypeList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.distributionIndiCommissionType
  },
  []
);

export const parentDirSubRelationList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.parentDirSubRelation
  },
  []
);

export const subSubRelationList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.subSubRelation
  },
  []
);

export const multiSubRelationList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.multiSubRelation
  },
  []
);

export const multiCommissionTypeList = handleActions(
  {
    [GET_DIRSTRIBUTION_BASIC_RESOURCE]: (state, { type, payload }) =>
      payload.multiCommissionType
  },
  []
);
