import { handleActions } from 'redux-actions';
import { languages } from 'utils/config';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  // GET_BRAND_INFO,
  GET_RECEIVER_LIST,
  GET_MENU_LIST,
  GET_MENU_DETAILS,
  GET_ROLE_LIST
} from './actions';
import i18n from 'utils/i18n';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const receiverList = handleActions(
  {
    [GET_RECEIVER_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const loginModuleList = handleActions(
  {
    // [GET_RECEIVER_LIST]: (state, { type, payload }) => payload
  },
  [
    {
      type: 'CENTER',
      label: i18n['brand.setting.login.type.center'],
      pic: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/login_module_center.png'
    },
    {
      type: 'LEFT',
      label: i18n['brand.setting.login.type.left'],
      pic: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/login_module_left.png'
    },
    {
      type: 'RIGHT',
      label: i18n['brand.setting.login.type.right'],
      pic: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/login_module_right.png'
    }
  ]
);

export const themeList = handleActions(
  {
    // [GET_RECEIVER_LIST]: (state, { type, payload }) => payload
  },
  [
    {
      themeId: 'GREEN',
      label: i18n['brand.setting.theme.type.green'],
      colorValue: '#00a8a6',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/green.png'
    },
    {
      themeId: 'BLUE',
      label: i18n['brand.setting.theme.type.blue'],
      colorValue: '#1990ff',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/blue.png'
    },
    {
      themeId: 'PURPLE',
      label: i18n['brand.setting.theme.type.purple'],
      colorValue: '#722ed0',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/purple.png'
    },
    {
      themeId: 'DARK_BLUE',
      label: i18n['brand.setting.theme.type.dark_blue'],
      colorValue: '#2d53e5',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/dark_blue.png'
    },
    {
      themeId: 'BROWN',
      label: i18n['brand.setting.theme.type.brown'],
      colorValue: '#a26127',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/brown.png'
    },
    {
      themeId: 'ORANGE',
      label: i18n['brand.setting.theme.type.orange'],
      colorValue: '#ff8800',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/orange.png'
    },
    {
      themeId: 'RED',
      label: i18n['brand.setting.theme.type.red'],
      colorValue: '#f53a37',
      previewUrl: '//broker-upload.oss-cn-hangzhou.aliyuncs.com/theme_module/red.png'
    }
  ]
);

export const menuList = handleActions(
  {
    [GET_MENU_LIST]: (state, { payload }) => payload
  },
  []
);
export const menuDetails = handleActions(
  {
    [GET_MENU_DETAILS]: (state, { payload }) => payload
  },
  {}
);
export const roleList = handleActions(
  {
    [GET_ROLE_LIST]: (state, { payload }) => payload
  },
  []
);
