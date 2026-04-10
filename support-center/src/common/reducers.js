import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  CLOSE_LOADING_BAR,
  CLOSE_TIPS_MODAL,
  CLOSE_TOP_ALERT,
  CLOSE_TRANSPARENT_MASK,
  GET_CUSTOM_PLATFORM_MENUS,
  GET_TENANT_INFO,
  GET_MENU,
  GET_SYSTEM_LANGUAGES,
  GET_VERSION_RIGHTS,
  SHOW_LOADING_BAR,
  SHOW_TIPS_MODAL,
  SHOW_TOP_ALERT,
  SHOW_TRANSPARENT_MASK
} from './actions.js';
import { languages as LANGUAGES } from 'utils/config';
import { MENU } from './constant';
import { getTenantId } from 'utils/tenantInfo';
import i18n from 'utils/i18n';

// tips modal data
const tipsModalData = handleActions(
  {
    [CLOSE_TIPS_MODAL]: () => null,
    [SHOW_TIPS_MODAL]: (state, { payload }) => payload
  },
  null
);

// top alert data
const topAlertData = handleActions(
  {
    [CLOSE_TOP_ALERT]: () => null,
    [SHOW_TOP_ALERT]: (state, { payload }) => payload
  },
  null
);

const loading = handleActions(
  {
    [SHOW_LOADING_BAR]: () => true,
    [CLOSE_LOADING_BAR]: () => false
  },
  false
);

const transparentMask = handleActions(
  {
    [SHOW_TRANSPARENT_MASK]: () => true,
    [CLOSE_TRANSPARENT_MASK]: () => false
  },
  false
);

const tenantInfo = handleActions(
  {
    [GET_TENANT_INFO]: (state, { payload }) => payload
  },
  {}
);

const versionRights = handleActions(
  {
    [GET_VERSION_RIGHTS]: (state, { payload }) => payload
  },
  {}
);

const languages = handleActions(
  {
    // 根据系统语言配置进行可用筛选
    [GET_SYSTEM_LANGUAGES]: (state, { payload }) => {
      if (payload) {
        // 筛选掉SC配置中，不被支持的语言项
        return LANGUAGES.filter(lang => payload.findIndex(_lang => _lang.enabled && _lang.value == lang.value) !== -1);
      } else return state;
    }
  },
  LANGUAGES
);

const menus = handleActions(
  {
    [GET_MENU]: (state, { payload }) => {
      let copyData = JSON.parse(JSON.stringify(state));
      const categories = Object.keys(payload);
      const tenantId = getTenantId();
      const enableProdConsumptionId = ['T001160', 'T000004', 'T001152', 'T001413'];
      const enableQaConsumptionId = ['T001229', 'T001312'];

      copyData = copyData
        .filter(item => categories.includes(item.category) || item.default)
        .map(item => {
          if (item.default) {
            return item;
          }

          return {
            ...item,
            subMenu: item.subMenu && item.subMenu.filter(sub => payload[item.category].includes(sub.key) || sub.default)
          };
        });

      // if ((__QA__ && !enableQaConsumptionId.includes(tenantId)) || (__PROD__ && !enableProdConsumptionId.includes(tenantId))) {
      //   copyData = copyData.filter(item => item.category !== 'consumption');
      // }

      return copyData;
    },
    [GET_CUSTOM_PLATFORM_MENUS]: (state, { payload }) => {
      //转换出自定义的subMenu
      const customsSubMenus = payload.map(({ key, name }) => ({
        label: `${i18n['trader.customSetting.menu.prefix']}${name}`,
        link: `/home/trader/customSetting/${key}`,
        default: true,
        module: 'home'
      }));

      //将自定义平台menu数据塞入总的menu数据中
      return state.map(menu => {
        if (menu.eventKey === 'trader') {
          const newSubMenu = [...menu.subMenu, ...customsSubMenus];
          return { ...menu, subMenu: newSubMenu };
        }
        return menu;
      });
    }
  },
  MENU
);

const customPlatforms = handleActions(
  {
    [GET_CUSTOM_PLATFORM_MENUS]: (state, { payload }) => payload
  },
  []
);

export default combineReducers({
  tipsModalData,
  topAlertData,
  loading,
  transparentMask,
  tenantInfo,
  languages,
  menus,
  versionRights,
  customPlatforms
});
