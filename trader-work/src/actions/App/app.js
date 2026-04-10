import api from "@/api";
import { createAction } from "redux-actions";
import {
  ls,
  ACCOUNT_DATA,
  ACCOUNT_TOKEN,
  USER_INFO,
  LAST_USER_LOGIN_TIME,
  TOKEN
} from "@/utils/storage";
// import { updateI18n } from "@/utils/i18n";

export const APP_STRUCTURAL_CONFIG = "APP_STRUCTURAL_CONFIG";
export const APP_PROXY_SETTING = "APP_PROXY_SETTING";
export const APP_GET_ACCOUNT_LIST = "APP_GET_ACCOUNT_LIST";
export const APP_ACCOUNT_TO_STATE = "APP_ACCOUNT_TO_STATE";
export const APP_STRUCT_TO_STATE = "APP_STRUCT_TO_STATE";
export const APP_HEADER_TITLE = "APP_HEADER_TITLE";
export const APP_AUTH = "APP_AUTH";
export const APP_LOGOUT = "APP_LOGOUT";
export const APP_FETCH_NOTICES = "APP_FETCH_NOTICES";
export const COMMON_GET_SERVER_NOTICE = "COMMON_GET_SERVER_NOTICE";
export const GET_CUSTOM_MENU = "GET_CUSTOM_MENU";
export const APP_GET_TRADER_MENU = "APP_GET_TRADER_MENU";

export const APP_PASS_TEST = "APP_PASS_TEST";
/*
 *   子类可直接使用structConfig（获取所有桥配置信息）、
 *   struct（当前账户桥配置信息）、account（当前账户信息）、
 *   accountList（所有账户信息）
 *
 */
// 获取租户基础配置信息，如账号类型，基本设置权限，开户字段等
export const getStructuralConfig = createAction(APP_STRUCTURAL_CONFIG, () =>
  api.get("/v2/user/product/conf/structural/list")
);
// 获取全民代理设置
export const getProxySetting = createAction(APP_PROXY_SETTING, () =>
  api.get("/v1/all/proxy/setting")
);

// 获取账号列表
export const getAccountList = createAction(APP_GET_ACCOUNT_LIST, () =>
  api.get("/v1/accounts")
);
// 将账户信息加载到state中，页面中会频繁使用，避免每次从localStorage中获取
export const loadAccount2state = createAction(APP_ACCOUNT_TO_STATE);
// 将桥结构信息加载到state中，页面中会频繁使用，避免每次从structural list中根据vendor筛选
export const loadStruct2state = struct => ({
  type: APP_STRUCT_TO_STATE,
  payload: struct
});
//设置页眉标题，通过state
export const setHeaderTitle = value => {
  return {
    type: APP_HEADER_TITLE,
    payload: value
  };
};
// 获取未读消息
export const getUnreadNotices = createAction(APP_FETCH_NOTICES, type =>
  api.post("/v1/message/listUnRead", {
    queryType: "INBOX",
    type: type //WEB_ALERT弹框消息  WEB 系统通知
  })
);
//账户登录接口
export const auth = createAction(APP_AUTH, (account, struct) => dispatch => {
  const userInfo = ls.getItem(USER_INFO);
  const params = {
    account: account.account,
    serverId: account.serverId,
    tenantId: userInfo.locationInfo ? userInfo.locationInfo.tenantId : "",
    vendor: account.vendor
  };
  return dispatch({
    type: APP_AUTH,
    payload: api.post("/v1/account/auth", params).then(res => {
      if (res.result) {
        ls.setItem(ACCOUNT_DATA, {
          accountToken: res.data,
          currAccount: account
        });
        ls.setItem(ACCOUNT_TOKEN, res.data);
        dispatch(loadAccount2state());
        if (struct) {
          dispatch(loadStruct2state(struct));
        }
      } else {
        ls.removeItem(ACCOUNT_DATA);
        ls.removeItem(ACCOUNT_TOKEN);
      }
      return Promise.resolve(res);
    })
  });
});

//账户登出接口
export const logout = createAction(APP_LOGOUT, () =>
  api
    .post(`/v1/user/logout?apiToken=${localStorage.getItem(TOKEN)}`)
    .then(res => {
      if (res.result) {
        ls.removeItem(USER_INFO);
        ls.removeItem(ACCOUNT_DATA);
        ls.removeItem(ACCOUNT_TOKEN);
        ls.removeItem(LAST_USER_LOGIN_TIME);
        ls.removeItem(TOKEN);
      }
      return Promise.resolve(res);
    })
);

//  停服通知
export const getServerNotice = createAction(COMMON_GET_SERVER_NOTICE, () => {
  return api.get("/v1/ops/tenants/release/notice");
});

//  判断是否测试通过
export const isPassTest = createAction(APP_PASS_TEST, () => {
  return api.get("/v1/account/appropriatenessTest/result");
});
// 获取自定义菜单
// export const getCustomMenu = createAction(GET_CUSTOM_MENU, () => {
//   return api.get("/v1/ops/product/menu/trader/web").then(rs => {
//     if (rs.result) {
//       updateI18n(rs.data);
//     }
//     return rs;
//   });
// });

// 新版获取自定义菜单
export const getTraderMenu = createAction(APP_GET_TRADER_MENU, platform => {
  return api.get(`/v2/os/products/menu/trader/${platform}`);
});
