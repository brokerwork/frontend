import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_BRAND_INFO, GET_THEME_LIST, GET_MENU_LIST, GET_PARENT_MENU } from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const brandInfo = handleActions(
  {
    [GET_BRAND_INFO]: (state, { payload }) => payload
  },
  {}
);

export const themeList = handleActions(
  {
    [GET_THEME_LIST]: (state, { payload }) => payload
  },
  []
);
export const menuList = handleActions(
  {
    [GET_MENU_LIST]: (state, { payload }) => payload
  },
  []
);
export const parentMenuList = handleActions(
  {
    [GET_PARENT_MENU]: (state, { payload }) => {
      if (payload && payload.length) {
        const list = payload.map(item => ({ label: item.name, value: item.key }));
        return list;
      }
      return payload;
    }
  },
  []
);

export const loginModuleList = handleActions(
  {
    // [GET_RECEIVER_LIST]: (state, { type, payload }) => payload
  },
  {
    default: [
      {
        type: 'CENTER',
        label: i18n['brand.setting.login.type.center'],
        pic: require('assets/images/login_module_default_center.jpg')
      },
      {
        type: 'LEFT',
        label: i18n['brand.setting.login.type.left'],
        pic: require('assets/images/login_module_default_left.jpg')
      },
      {
        type: 'RIGHT',
        label: i18n['brand.setting.login.type.right'],
        pic: require('assets/images/login_module_default_right.jpg')
      }
    ],
    '1': [
      {
        type: 'CENTER',
        label: i18n['brand.setting.login.type.center'],
        pic: require('assets/images/login_module_1_center.jpg')
      },
      {
        type: 'LEFT',
        label: i18n['brand.setting.login.type.left'],
        pic: require('assets/images/login_module_1_left.jpg')
      },
      {
        type: 'RIGHT',
        label: i18n['brand.setting.login.type.right'],
        pic: require('assets/images/login_module_1_right.jpg')
      }
    ],
    '2': [
      {
        type: 'CENTER',
        label: i18n['brand.setting.login.type.center'],
        pic: require('assets/images/login_module_2_center.jpg')
      },
      {
        type: 'LEFT',
        label: i18n['brand.setting.login.type.left'],
        pic: require('assets/images/login_module_2_left.jpg')
      },
      {
        type: 'RIGHT',
        label: i18n['brand.setting.login.type.right'],
        pic: require('assets/images/login_module_2_right.jpg')
      }
    ],
    '3': [
      {
        type: 'CENTER',
        label: i18n['brand.setting.login.type.center'],
        pic: require('assets/images/login_module_3_center.jpg')
      },
      {
        type: 'LEFT',
        label: i18n['brand.setting.login.type.left'],
        pic: require('assets/images/login_module_3_left.jpg')
      },
      {
        type: 'RIGHT',
        label: i18n['brand.setting.login.type.right'],
        pic: require('assets/images/login_module_3_right.jpg')
      }
    ],
    '4': [
      {
        type: 'CENTER',
        label: i18n['brand.setting.login.type.center'],
        pic: require('assets/images/login_module_4_center.jpg')
      },
      {
        type: 'LEFT',
        label: i18n['brand.setting.login.type.left'],
        pic: require('assets/images/login_module_4_left.jpg')
      },
      {
        type: 'RIGHT',
        label: i18n['brand.setting.login.type.right'],
        pic: require('assets/images/login_module_4_right.jpg')
      }
    ]
  }
);
