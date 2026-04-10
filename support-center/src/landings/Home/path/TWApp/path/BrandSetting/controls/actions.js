import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "TWAPP_BRAND_SETTING_";
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const SAVE_BRAND_INFO = `${PRE_FIX}SAVE_BRAND_INFO`;
export const GET_DATA = `${PRE_FIX}GET_DATA`;
export const MODIFY_DISCLAIMER = `${PRE_FIX}MODIFY_DISCLAIMER`;
export const SET_DISCLAIMER = `${PRE_FIX}SET_DISCLAIMER`;
export const MODIFY_ABOUT_US = `${PRE_FIX}MODIFY_ABOUT_US`;
export const SET_ABOUT_US = `${PRE_FIX}SET_ABOUT_US`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取品牌信息
export const getBrandInfo = createAction(GET_BRAND_INFO, () =>
  get({
    url: "/v1/ops/product/conf/guide"
  })
);

// 设置品牌信息
export const saveBrandInfo = createAction(SAVE_BRAND_INFO, info =>
  post({
    url: "/v1/ops/product/conf/guide",
    data: info
  })
);

// 获取免责声明/关于我们信息
export const getData = createAction(GET_DATA, () =>
  get({
    url: "/v2/os/products/app/configuration"
  })
);

// 修改免责声明
export const modifyDisclaimer = createAction(MODIFY_DISCLAIMER, str => str);

// 设置免责声明
export const setDisclaimer = createAction(SET_DISCLAIMER, data =>
  post({
    url: "/v2/os/products/app/configuration/disclaimer",
    data: {
      disclaimer: data
    }
  })
);

// 修改关于我们
export const modifyAboutUs = createAction(MODIFY_ABOUT_US, str => str);

// 设置关于我们
export const setAboutUs = createAction(SET_ABOUT_US, data =>
  post({
    url: "/v2/os/products/app/configuration/aboutus",
    data: {
      aboutUs: data
    }
  })
);
