import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { ls, ACCOUNT_DATA } from "@/utils/storage";
import {
  APP_STRUCTURAL_CONFIG,
  APP_PROXY_SETTING,
  APP_GET_ACCOUNT_LIST,
  APP_STRUCT_TO_STATE,
  APP_ACCOUNT_TO_STATE,
  APP_HEADER_TITLE,
  APP_FETCH_NOTICES,
  COMMON_GET_SERVER_NOTICE,
  APP_GET_TRADER_MENU
} from "@/actions/App/app";

const structConfig = handleActions(
  {
    [APP_STRUCTURAL_CONFIG]: (state, { payload }) => {
      if (payload && payload.length > 0) {
        const obj = {};
        payload.forEach(e => {
          obj[e.structural] = e;
        });
        return obj;
      }
      return null;
    }
  },
  null
);
const proxySetting = handleActions(
  {
    [APP_PROXY_SETTING]: (state, { payload }) => payload
  },
  {}
);
const unReadNotices = handleActions(
  {
    [APP_FETCH_NOTICES]: (state, { payload }) => payload
  },
  []
);
const struct = handleActions(
  {
    [APP_STRUCT_TO_STATE]: (state, { payload }) => payload
  },
  null
);
const account = handleActions(
  {
    [APP_ACCOUNT_TO_STATE]: () => {
      const data = window.localStorage.getItem(ACCOUNT_DATA);
      return data ? JSON.parse(data) : null;
    }
  },
  null
);
const serverNotice = handleActions(
  {
    [COMMON_GET_SERVER_NOTICE]: (state, { payload }) => {
      return payload;
    }
  },
  ""
);
const accountList = handleActions(
  {
    [APP_GET_ACCOUNT_LIST]: (state, { payload }) => {
      // let accounts: Array<AccountDetail> = payload.tradeAccounts.map(e => {
      //     e.email = payload.email
      //     return e;
      // })//email信息放入账号中
      let accounts = payload.tradeAccounts;
      let demoAccountList = accounts.filter(e => {
        return e.accountType == "Demo";
      });
      let liveAccountList = accounts.filter(e => {
        return e.accountType == "Live";
      });
      return { demoAccountList, liveAccountList, accountInfo: payload };
    }
  },
  { demoAccountList: [], liveAccountList: [], accountInfo: null }
);
const headerTitle = handleActions(
  {
    [APP_HEADER_TITLE]: (state, { payload }) => payload
  },
  ""
);
const traderMenus = handleActions(
  {
    [APP_GET_TRADER_MENU]: (state, { payload }) => payload
  },
  []
);

export default combineReducers({
  structConfig,
  proxySetting,
  struct,
  account,
  accountList,
  headerTitle,
  unReadNotices,
  serverNotice,
  traderMenus
});
