import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'BROKER_BRAND_SETTING_';
export const UPDATE_BRAND_INFO = `${PRE_FIX}UPDATE_BRAND_INFO`;
export const VALID_DOMAIN = `${PRE_FIX}VALID_DOMAIN`;
export const GET_RECEIVER_LIST = `${PRE_FIX}GET_RECEIVER_LIST`;
export const GET_MENU_LIST = `${PRE_FIX}GET_MENU_LIST`;
export const UPDATE_MENU_CODE = `${PRE_FIX}UPDATE_MENU_CODE`;
export const RESET_MENU_CODE = `${PRE_FIX}RESET_MENU_CODE`;
export const ADD_OR_EDIT_MENU = `${PRE_FIX}ADD_OR_EDIT_MENU`;
export const GET_PARENT_MENU = `${PRE_FIX}GET_PARENT_MENU`;
export const ENABLED_OR_DISABLED_MENU = `${PRE_FIX}ENABLED_OR_DISABLED_MENU`;
export const GET_MENU_DETAILS = `${PRE_FIX}GET_MENU_DETAILS`;
export const MEUN_SORTS = `${PRE_FIX}MEUN_SORTS`;
export const UPDATE_MENUS = `${PRE_FIX}UPDATE_MENUS`;
export const GET_ROLE_LIST = `${PRE_FIX}GET_ROLE_LIST`;
export const MENU_ENABLED = `${PRE_FIX}MENU_ENABLED`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const updateBrandInfo = createAction(UPDATE_BRAND_INFO, info =>
  post({
    url: '/v1/ops/product/conf/brand',
    data: {
      ...info,
      productId: 'BW'
    }
  })
);

// 查询用户
export const getReceiverList = createAction(GET_RECEIVER_LIST, ({ search }) =>
  get({
    url: `/v2/os/config/bw/user?keyword=${search}`
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
// 获取菜单列表
export const getMenuList = createAction(GET_MENU_LIST, () =>
  post({
    url: `/v1/ops/product/menu/broker/list`
  })
);
// 获取菜单详情
export const geMenuDetails = createAction(GET_MENU_DETAILS, id =>
  post({
    url: `/v1/ops/product/menu/broker/${id}`
  })
);
// 菜单排序
export const menuSorts = createAction(MEUN_SORTS, data =>
  post({
    url: `/v1/ops/product/menu/broker/setOrder`,
    data
  })
);
// 新增或修改菜单
export const updateMenus = createAction(UPDATE_MENUS, data =>
  post({
    url: `/v1/ops/product/menu/broker/upsert`,
    data
  })
);
// 获取角色列表
export const getRoleList = createAction(GET_ROLE_LIST, () =>
  post({
    url: `/v1/ops/user/role/list`
  })
);
// 菜单启用或禁用
export const menuEnabled = createAction(MENU_ENABLED, data =>
  post({
    url: `/v1/ops/product/menu/broker/setEnable`,
    data
  })
);
