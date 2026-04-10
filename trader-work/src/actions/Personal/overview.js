import api from "@/api";
import { createAction } from "redux-actions";
import { ls, ACCOUNT_DATA, USER_INFO } from "@/utils/storage";
import { loadAccount2state } from "@/actions/App/app";

export const OVERVIEW_SET_DEFAULT_COUNT = "OVERVIEW_SET_DEFAULT_COUNT";
export const OVERVIEW_CANCEL_DEFAULT_COUNT = "OVERVIEW_CANCEL_DEFAULT_COUNT";
export const OVERVIEW_ACCOUNT_ACTIVE = "OVERVIEW_ACCOUNT_ACTIVE";
export const OVERVIEW_GET_PLATFORM_LIST = "OVERVIEW_GET_PLATFORM_LIST";
export const OVERVIEW_GET_ASSETS_CHILD_LIST = "OVERVIEW_GET_ASSETS_CHILD_LIST";
export const OVERVIEW_GET_COMPANY_CHILD_LIST =
  "OVERVIEW_GET_COMPANY_CHILD_LIST";
export const OVERVIEW_GET_POINTS =
  "OVERVIEW_GET_POINTS";
// 设置默认帐户
export const setDefaultAccouont = createAction(
  OVERVIEW_SET_DEFAULT_COUNT,
  data =>
    api
      .post("/v1/account/set/loginAccount", data)
      .then(res => Promise.resolve(res))
);
// 取消默认帐户
export const cancelDefaultAccouont = createAction(
  OVERVIEW_CANCEL_DEFAULT_COUNT,
  data =>
    api
      .post("/v1/account/delete/loginAccount", data)
      .then(res => Promise.resolve(res))
);
// 帐户激活
export const accountActive = createAction(OVERVIEW_ACCOUNT_ACTIVE, params =>
  api.post("/v1/account/activate", params).then(res => Promise.resolve(res))
);
// 获取平台列表
export const getPlatformList = createAction(OVERVIEW_GET_PLATFORM_LIST, () =>
  api.get("/v1/account/platform/list").then(res => Promise.resolve(res))
);
// 获取被资管账户列表
export const getAssetsChildList = createAction(
  OVERVIEW_GET_ASSETS_CHILD_LIST,
  data =>
    api.post("/v1/user/asset/accounts", data).then(res => Promise.resolve(res))
);
// 获取子公司列表
export const getCompanyChildList = createAction(
  OVERVIEW_GET_COMPANY_CHILD_LIST,
  data =>
    api
      .post("/v1/user/children/accounts", data)
      .then(res => Promise.resolve(res))
);
// 获取积分字段
export const getPointsFields = createAction(OVERVIEW_GET_POINTS, () =>
  api.get("/v1/ops/tenants/metadata/form-field/list?tableName=t_user_profiles").then(res => Promise.resolve(res))
);
