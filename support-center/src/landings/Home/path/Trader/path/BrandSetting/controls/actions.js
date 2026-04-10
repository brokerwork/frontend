import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_BRAND_SETTING_';
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const UPDATE_BRAND_INFO = `${PRE_FIX}UPDATE_BRAND_INFO`;
export const VALID_DOMAIN = `${PRE_FIX}VALID_DOMAIN`;
export const GET_THEME_LIST = `${PRE_FIX}GET_THEME_LIST`;
export const GET_MENU_LIST = `${PRE_FIX}GET_MENU_LIST`;
export const UPDATE_MENU_CODE = `${PRE_FIX}UPDATE_MENU_CODE`;
export const RESET_MENU_CODE = `${PRE_FIX}RESET_MENU_CODE`;
export const ADD_OR_EDIT_MENU = `${PRE_FIX}ADD_OR_EDIT_MENU`;
export const GET_PARENT_MENU = `${PRE_FIX}GET_PARENT_MENU`;
export const ENABLED_OR_DISABLED_MENU = `${PRE_FIX}ENABLED_OR_DISABLED_MENU`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getBrandInfo = createAction(GET_BRAND_INFO, () =>
  get({
    url: '/v1/ops/product/conf/brand',
    data: {
      productId: 'TW'
    }
  })
);

export const updateBrandInfo = createAction(UPDATE_BRAND_INFO, info =>
  post({
    url: '/v1/ops/product/conf/brand',
    data: {
      ...info,
      productId: 'TW'
    }
  })
);

export const validDomain = createAction(VALID_DOMAIN, (productDomain, customerDomain) =>
  get({
    url: '/v1/internet/domain/valid',
    data: {
      customerDomain,
      productDomain
    }
  })
);

export const getThemeList = createAction(GET_THEME_LIST, () =>
  get({
    url: '/v1/ops/tenants/theme/list',
    data: {
      productId: 'TW'
    }
  })
);
// 获取菜单列表
export const getMenuList = createAction(GET_MENU_LIST, platform =>
  get({
    url: `/v2/os/products/menu/sc/${platform}`
  })
);
// 修改菜单
export const updateMenuCode = createAction(UPDATE_MENU_CODE, data =>
  post({
    url: `/v1/ops/product/menu/i18n`,
    data
  })
);
// 恢复默认菜单国际化
export const resetMenu = createAction(RESET_MENU_CODE, platform =>
  post({
    url: `/v2/os/products/menu/recovery/${platform}`
  })
);
// 新增或编辑菜单栏
export const addOrEditMenu = createAction(ADD_OR_EDIT_MENU, data =>
  post({
    url: `/v2/os/products/menu/upsert`,
    data
  })
);
// 获取一级导航数据
export const getParentMenu = createAction(GET_PARENT_MENU, platform =>
  get({
    url: `/v2/os/products/menu/parent/${platform}`
  })
);
// 启用导航 或禁用
export const enableOrDisableMenu = createAction(ENABLED_OR_DISABLED_MENU, (type, id) =>
  post({
    url: `/v2/os/products/menu/${type}/${id}`
  })
);
