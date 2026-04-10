import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  COMMON_GET_MODULES,
  COMMON_FETCH_BRAND_INFO,
  COMMON_SHOW_LOADING,
  COMMON_CLOSE_LOADING,
  COMMON_GET_COUNTRY_PHONE,
  COMMON_GET_NATIONS,
  COMMON_GET_UPLOADINFO,
  COMMON_GET_VERSION,
  COMMON_CHECK_TOKEN,
  COMMON_GET_NATION,
  COMMON_CONFIG_ACCESS,
  COMMON_GET_FA_DATA,
  COMMON_GET_ACCOUNT_DEMO_CHECK,
  COMMON_GET_ACCOUNT_TYPE_CONFIG
} from "@/actions/Common/common";
import { OPEN_SAVE_CTID } from "@/actions/Account/openAccount";
const modules = handleActions(
  {
    [COMMON_GET_MODULES]: (state, { payload }) => payload
  },
  []
);

const brandInfo = handleActions(
  {
    [COMMON_FETCH_BRAND_INFO]: (state, { payload }) => payload
  },
  {}
);
const loading = handleActions(
  {
    [COMMON_SHOW_LOADING]: () => true,
    [COMMON_CLOSE_LOADING]: () => false
  },
  false
);
const nations = handleActions(
  {
    [COMMON_GET_NATIONS]: (state, { payload }) => payload
  },
  []
);
const uploadInfo = handleActions(
  {
    [COMMON_GET_UPLOADINFO]: (state, { payload }) => payload
  },
  {}
);

const countryPhone = handleActions(
  {
    [COMMON_GET_COUNTRY_PHONE]: (state, { payload }) => {
      return payload;
    }
  },
  []
);
const isLogin = handleActions(
  {
    [COMMON_CHECK_TOKEN]: (state, { payload }) => payload
  },
  null
);

const version = handleActions(
  {
    [COMMON_GET_VERSION]: (state, { payload }) => payload
  },
  ""
);

const nationData = handleActions(
  {
    [COMMON_GET_NATION]: (state, { payload }) => payload
  },
  null
);
export const ctid = handleActions(
  {
    [OPEN_SAVE_CTID]: (state, { payload }) => payload
  },
  ""
);
//  登录注册页SC配置
export const configAcessResult = handleActions(
  {
    [COMMON_CONFIG_ACCESS]: (state, { payload }) => payload
  },
  {}
);
export const validateSettingData = handleActions(
  {
    [COMMON_GET_FA_DATA]: (state, { payload }) => payload || []
  },
  []
);
export const accountDemoCheck = handleActions(
  {
    [COMMON_GET_ACCOUNT_DEMO_CHECK]: (state, { payload }) => payload
  },
  {}
);
export const accountTypeConfig = handleActions(
  {
    [COMMON_GET_ACCOUNT_TYPE_CONFIG]: (state, { payload }) => payload
  },
  {}
);
export default combineReducers({
  modules,
  brandInfo,
  loading,
  countryPhone,
  nations,
  uploadInfo,
  isLogin,
  version,
  nationData,
  ctid,
  configAcessResult,
  validateSettingData,
  accountDemoCheck,
  accountTypeConfig
});
