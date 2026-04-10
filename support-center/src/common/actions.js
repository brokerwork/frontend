import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import language from 'utils/language';
import { getToken, removeToken } from 'utils/userInfo';
import { saveTenantInfo } from 'utils/tenantInfo';

// ----------------------------------------------
// Action constans
// ----------------------------------------------

const PRE_FIX = 'GLOBAL_ACTIONS_';
export const SHOW_TIPS_MODAL = `${PRE_FIX}SHOW_TIPS_MODAL`;
export const CLOSE_TIPS_MODAL = `${PRE_FIX}CLOSE_TIPS_MODAL`;
export const SHOW_TOP_ALERT = `${PRE_FIX}SHOW_TOP_ALERT`;
export const CLOSE_TOP_ALERT = `${PRE_FIX}CLOSE_TOP_ALERT`;
export const SHOW_LOADING_BAR = `${PRE_FIX}SHOW_LOADING_BAR`;
export const CLOSE_LOADING_BAR = `${PRE_FIX}CLOSE_LOADING_BAR`;

export const SHOW_TRANSPARENT_MASK = `${PRE_FIX}SHOW_TRANSPARENT_MASK`;
export const CLOSE_TRANSPARENT_MASK = `${PRE_FIX}CLOSE_TRANSPARENT_MASK`;

export const GET_I18N_DATA = `${PRE_FIX}GET_I18N_DATA`;
export const CHANGE_LANGUAGE = `${PRE_FIX}CHANGE_LANGUAGE`;
export const GET_TENANT_INFO = `${PRE_FIX}GET_TENANT_INFO`;
export const LOGOUT = `${PRE_FIX}LOGOUT`;
export const GET_MENU = `${PRE_FIX}GET_MENU`;
export const GET_SYSTEM_LANGUAGES = `${PRE_FIX}GET_SYSTEM_LANGUAGES`;
export const GET_CUSTOM_PLATFORM_MENUS = `${PRE_FIX}GET_CUSTOM_PLATFORM_MENUS`;
export const GET_VERSION_RIGHTS = `${PRE_FIX}GET_VERSION_RIGHTS`;

// ----------------------------------------------
// Action creaters
// ----------------------------------------------

// 显示tipsModal
export const showTipsModal = createAction(SHOW_TIPS_MODAL, data => data);

// 关闭tipsModal
export const closeTipsModal = createAction(CLOSE_TIPS_MODAL);

// 显示顶部alert信息
export const showTopAlert = createAction(SHOW_TOP_ALERT, data => data);

// 隐藏顶部alert
export const closeTopAlert = createAction(CLOSE_TOP_ALERT);

// 显示/隐藏顶部loading bar
export const showLoadingBar = createAction(SHOW_LOADING_BAR);
export const closeLoadingBar = createAction(CLOSE_LOADING_BAR);
// 显示/隐藏顶部透明遮罩层
export const showTransparentMask = createAction(SHOW_TRANSPARENT_MASK);
export const closeTransparentMask = createAction(CLOSE_TRANSPARENT_MASK);

export const getI18nData = createAction(GET_I18N_DATA, () => {
  return get({
    url: '/api/v1/static/version'
  }).then(version => {
    if (!version.result) return Promise.resolve(version);
    if (Number(version.data) <= Number(language.getVersion())) return Promise.resolve(version);

    language.setVersion(version.data);

    const lang = language.getLang();
    return get({
      url: `/v2/os/tenants/i18n/SC/${lang}`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      language.setData(res.data);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);

      return Promise.resolve(res);
    });
  });
});

export const changeLanguage = createAction(CHANGE_LANGUAGE, lang => {
  language.setLang(lang);

  return get({
    url: `/v2/os/tenants/i18n/SC/${lang}`
  }).then(res => {
    if (res.result) {
      language.setData(res.data);

      window.location.reload(true);
    }

    return Promise.resolve(res);
  });
});

export const getTenantInfo = createAction(GET_TENANT_INFO, () => {
  return get({
    url: '/v2/os/dashboard'
  }).then(res => {
    if (res.result) {
      saveTenantInfo(res.data);
    }

    return Promise.resolve(res);
  });
});

export const logout = createAction(LOGOUT, () => {
  return post({
    url: `/v1/pub/auth/logout?token=${getToken()}`
  }).then(res => {
    if (res.result) {
      removeToken();
    }

    return Promise.resolve(res);
  });
});

export const getMenu = createAction(GET_MENU, () =>
  get({
    url: '/v2/os/dashboard/menu'
  })
);

export const getSystemLanguages = createAction(GET_SYSTEM_LANGUAGES, () =>
  get({
    url: '/v1/common/lang' //'/v2/os/products/lang'
  })
);

export const getCustomPlatformMenus = createAction(GET_CUSTOM_PLATFORM_MENUS, () =>
  get({
    url: '/v2/os/dashboard/custom/structural'
  })
);

// const defaultRights = {
//   SC_SECURITY_SET: true,
//   SC_TWUI_SET: true,
//   SC_SENSITIVE_SYN: true,
//   SC_GRANTS_SET: true,
//   SC_PROPRIETY_TEST: true,
//   SC_ACCOUNTFROM_SET: true,
//   SC_FIELD_SET: true
// };
export const getVersionRights = createAction(GET_VERSION_RIGHTS, () =>
  get({
    url: '/v2/os/products/top/version/function'
  }).then(res => {
    if (!res.result) {
      return res;
    }
    const data = res.data.reduce((target, key) => {
      target[key] = true;
      return target;
    }, {});
    // const data = { ...defaultRights };
    return { result: true, data };
  })
);
