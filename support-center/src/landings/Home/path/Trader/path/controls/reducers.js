import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_BRAND_INFO,
  GET_LERERAGE_LIST,
  GET_PLAT_SETTING,
  GET_FIELD_TYPE,
  GET_MAX_LEVERAGE_LIST,
  GET_ACCOUNT_TYPE_LIST,
  GET_TOTAL_CACULATION_TYPE_LIST,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_LIMIT,
  GET_ACCESS_SETTING
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const brandInfo = handleActions(
  {
    [GET_BRAND_INFO]: (state, { payload }) => payload
  },
  {}
);

export const paltSetting = handleActions(
  {
    [GET_PLAT_SETTING]: (state, { payload }) => payload
  },
  {}
);

export const leverageList = handleActions(
  {
    [GET_LERERAGE_LIST]: (state, { payload }) => payload
  },
  []
);
export const maxLeverageList = handleActions(
  {
    [GET_MAX_LEVERAGE_LIST]: (state, { payload }) => payload
  },
  []
);
export const accountTypeList = handleActions(
  {
    [GET_ACCOUNT_TYPE_LIST]: (state, { payload }) => payload
  },
  []
);
export const totalCaculationTypeList = handleActions(
  {
    [GET_TOTAL_CACULATION_TYPE_LIST]: (state, { payload }) => payload
  },
  []
);

export const fieldType = handleActions(
  {
    [GET_FIELD_TYPE]: (state, { payload }) => payload
  },
  []
);

export const productDetail = handleActions(
  {
    [GET_PRODUCT_DETAIL]: (state, { payload }) => payload
  },
  {}
);

export const productLimit = handleActions(
  {
    [GET_PRODUCT_LIMIT]: (state, { payload }) => payload
  },
  {}
);

export const accessSetting = handleActions(
  {
    [GET_ACCESS_SETTING]: (state, { payload }) => payload
  },
  {}
);
