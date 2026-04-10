import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import defaultHeaderImage from './default.png';
import { MENUS } from 'utils/headerMenus';
import { languages } from 'utils/config';
import { getType } from 'utils/language';
import {
  GET_USER_INFO,
  UPDATE_USER_INFO,
  GET_UNREAD_MESSAGE,
  GET_UNREAD_MODAL_MESSAGE,
  GET_INTRODUCE_LINK,
  SHOW_TIPS_MODAL,
  CLOSE_TIPS_MODAL,
  SHOW_TOP_ALERT,
  CLOSE_TOP_ALERT,
  GET_BRAND_INFO,
  SHOW_LOADING_BAR,
  CLOSE_LOADING_BAR,
  GET_CURRENT_USER_RIGHT,
  SHOW_TRANSPARENT_MASK,
  CLOSE_TRANSPARENT_MASK,
  GET_TODO_TASKS_COUNT,
  GET_MY_LINK_QRCODE,
  PHONE_CALL_START,
  PHONE_CALL_END,
  INJECTE_VERSION_GUIDE_KEY,
  COMFIRM_VERSION_GUIDE_KEY,
  SHOW_BANNER_NOTICE,
  CLOSE_BANNER_NOTICE,
  CLOSE_REALESE_NOTICE,
  GET_TOP_RIGHT,
  GET_SYSTEM_SETTINGS,
  GET_PERSONAL_RULE,
  GET_OBJECTS,
  GET_PRODUCT_VAS_SWITCH,
  GET_CUSTOM_REPORT_LIST,
  SET_OR_CANCEL_USUAL_REPORT,
  INITIAL_USUAL_REPORT,
  GET_VERSION_RIGHTS,
  GET_ACCESS_CONFIG,
  GET_ACCOUNT_TYPE,
  UPDATE_LOGIN_IP_INFO,
  GET_POINTS,
  GET_POINTS_FIELDS,
  HANDLE_CUSTOM_MENU,
  GET_EXTRA_SERVICE
} from './actions.js';

export const TASK_TYPES = {
  TA: 'TA',
  AGENCY: 'AGENCY'
};
// 语言选项
const languageSelectors = handleActions(
  {
    [GET_BRAND_INFO]: (state, { payload }) => {
      if (payload.languages) {
        // 筛选掉SC配置中，不被支持的语言项
        return languages.filter(
          lang =>
            payload.languages.findIndex(
              _lang => _lang.value == lang.value && _lang.enabled
            ) !== -1
        );
      } else return state;
    }
  },
  //默认只有中文语言选项
  languages.filter(lang => lang.value === 'zh-CN')
);

const topRights = handleActions(
  {
    [GET_TOP_RIGHT]: (state, { payload }) => {
      return payload;
    }
  },
  []
);
// 用户信息
const userInfo = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => {
      if (!payload.headImage) {
        payload.headImage = defaultHeaderImage;
      }
      return payload;
    },
    [UPDATE_USER_INFO]: (state, { type, payload }) => {
      if (!payload.headImage) {
        payload.headImage = defaultHeaderImage;
      }
      return payload;
    }
  },
  {}
);

// 未读消息
const unreadMessage = handleActions(
  {
    [GET_UNREAD_MESSAGE]: (state, { payload }) => payload
  },
  []
);

// 未读弹窗消息
const unreadModalMessage = handleActions(
  {
    [GET_UNREAD_MODAL_MESSAGE]: (state, { payload }) => {
      if (!payload.result) {
        payload.data = [];
      }
      return payload;
    }
  },
  []
);

// 我的推广链接
const myIntroduceLink = handleActions(
  {
    [GET_INTRODUCE_LINK]: (state, { type, payload }) => payload
  },
  []
);

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

// top alert data
const bannerNoticeData = handleActions(
  {
    [CLOSE_BANNER_NOTICE]: () => null,
    [SHOW_BANNER_NOTICE]: (state, { payload }) => payload
  },
  null
);

const realeseNoticeData = handleActions(
  {
    [CLOSE_REALESE_NOTICE]: () => null,
    [GET_BRAND_INFO]: (state, { payload }) => {
      return payload.releaseNotice;
    }
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

const brandInfo = handleActions(
  {
    [GET_BRAND_INFO]: (state, { payload }) => payload
  },
  {}
);

const transparentMask = handleActions(
  {
    [SHOW_TRANSPARENT_MASK]: () => true,
    [CLOSE_TRANSPARENT_MASK]: () => false
  },
  false
);

const userRights = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => payload
  },
  {}
);

const navigation = handleActions(
  {
    [GET_OBJECTS]: (state, { type, payload }) => {
      const order = [TASK_TYPES.TA, TASK_TYPES.AGENCY];
      const orderRight = {
        [TASK_TYPES.TA]: 'TASK_TRADER',
        [TASK_TYPES.AGENCY]: 'TASK_IB'
      };
      const result = [];
      let total = 0;
      order.forEach(item => {
        const match = payload.find(task => task.itemType === item);
        if (match)
          result.push({
            label: match.itemName,
            link: `/taskmgmt/objects/${match.itemId}`,
            right: orderRight[item],
            taskType: match.itemType,
            todoCount: match.jobNum
          });
        total += match.jobNum;
      });
      return state.map(item => {
        if (item.id !== 'taskmgmt') return item;
        item.submenu = result;
        item.todoCount = total;
        return item;
      });
    },
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      let nav = [];
      if (state.length) {
        nav = state;
      } else {
        nav = MENUS;
      }
      const navigations = nav.filter(menu => {
        if (menu.right === 'USER') {
          return (
            payload['TAUSER_ENABLE'] ||
            payload['USER_SELECT'] ||
            payload['USER_ADD']
          );
        }
        return menu.right === undefined || payload[menu.right];
      });
      navigations.forEach(menu => {
        if (menu.submenu) {
          menu.submenu = menu.submenu.filter(submenu => {
            if (submenu.right === 'BW_USER') {
              return payload['USER_SELECT'] || payload['USER_ADD'];
            }
            if (
              submenu.right === 'STAT_VIEW_ACC' ||
              submenu.right === 'STAT_VIEW_COMMISSION'
            ) {
              submenu.submenu = submenu.submenu.filter(item => {
                return payload[item.right];
              });
            }
            if (submenu.right === undefined) return true;
            return payload[submenu.right];
          });
        }
        if (menu.externalMenu) {
          menu.externalMenu = menu.externalMenu.filter(externalMenu => {
            if (externalMenu.right === undefined) return true;
            return payload[externalMenu.right];
          });
        }
      });
      return navigations;
    },
    [GET_UNREAD_MESSAGE]: (state, { payload }) => {
      return state.map(item => {
        if (item.id !== 'msgmgmt') return item;
        item.todoCount = payload.length;
        return item;
      });
    },
    [GET_CUSTOM_REPORT_LIST]: (state, { payload }) => {
      return state.map(item => {
        if (item.id === 'reportmgmt') {
          const list = payload || [];
          const submenu = _.get(item, 'submenu', []);
          const customReportList = _.map(list, l => ({
            label: l.reportName,
            link: `/reportmgmt/customReport/${
              l.reportType === 'USER' ? 'userDetail' : 'detail'
            }/${l.id}`
          }));
          return {
            ...item,
            submenu: submenu.concat(customReportList)
          };
        } else {
          return item;
        }
      });
    }
  },
  []
);

const myLinkQrcode = handleActions(
  {
    [GET_MY_LINK_QRCODE]: (state, { payload }) => payload
  },
  ''
);
const phoneCallStatus = handleActions(
  {
    [PHONE_CALL_START]: (state, { payload }) => {
      return true;
    },
    [PHONE_CALL_END]: (state, { payload }) => {
      return false;
    }
  },
  false
);

const versionGuideKeys = handleActions(
  {
    [INJECTE_VERSION_GUIDE_KEY]: (state, { payload }) => payload,
    [COMFIRM_VERSION_GUIDE_KEY]: (state, { payload }) => payload
  },
  []
);
export const personalReportShow = handleActions(
  {
    [GET_SYSTEM_SETTINGS]: (state, { type, payload }) => payload
  },
  {}
);
export const personalRules = handleActions(
  {
    [GET_PERSONAL_RULE]: (state, { type, payload }) => payload
  },
  []
);

export const objectList = handleActions(
  {
    [GET_OBJECTS]: (state, { type, payload }) => {
      const order = [TASK_TYPES.TA, TASK_TYPES.AGENCY];
      return order.reduce((result, item) => {
        const match = payload.find(task => task.itemType === item);
        if (match) result.push(match);
        return result;
      }, []);
    }
  },
  []
);
const productVasSwitch = handleActions(
  {
    [GET_PRODUCT_VAS_SWITCH]: (state, { payload }) => payload
  },
  {
    VERIFICATION: false,
    SMS: false,
    EMAIL: false
  }
);

// 常用报表
export const usualReportList = handleActions(
  {
    [SET_OR_CANCEL_USUAL_REPORT]: (state, { type, payload }) => payload,
    [INITIAL_USUAL_REPORT]: (state, { type, payload }) => payload
  },
  {}
);
//大版本权限
export const versionRights = handleActions(
  {
    [GET_VERSION_RIGHTS]: (state, { type, payload }) => payload
  },
  {}
);
//sc配置
export const accessConfig = handleActions(
  {
    [GET_ACCESS_CONFIG]: (state, { type, payload }) => payload
  },
  {}
);
// 账户类型 把语言放到这里来吧，然后根据 server 来生成数据 {MT4: [], MT5: []}
export const accountTypes = handleActions(
  {
    [GET_ACCOUNT_TYPE]: (state, { type, payload }) => {
      if (Array.isArray(payload.accountTypeInfos)) {
        const lang = getType();
        let end = { MT4: [], MT5: [], all: [] };
        payload.accountTypeInfos.forEach(type => {
          const item = {
            value: type.customerAccountType,
            label:
              type.accountTypeName[lang] ||
              type.accountTypeName[Object.keys(type.accountTypeName)[0]]
          };
          ['MT4', 'MT5'].forEach(server => {
            const haveRight = _.get(type, `rights.${server}.length`, 0);
            if (haveRight) {
              end[server].push(item);
            }
          });
          end['all'].push(item);
        });
        return end;
      }
      return [];
    }
  },
  []
);
// 控制bw账户显示
export const bwAccountShow = handleActions(
  {
    [GET_ACCOUNT_TYPE]: (state, { type, payload }) => {
      if (payload.bwEnable === undefined) {
        return 'show';
      } else {
        return payload.bwEnable;
      }
    }
  },
  true
);
export const loginIpInfo = handleActions(
  {
    [UPDATE_LOGIN_IP_INFO]: (state, { type, payload }) => ({
      ...state,
      ...payload
    })
  },
  {
    closed: false
  }
);
export const points = handleActions(
  {
    [GET_POINTS]: (state, { type, payload }) => payload
  },
  {}
);
export const pointsMap = handleActions(
  {
    [GET_POINTS_FIELDS]: (state, { payload }) => {
      const obj = {};
      payload.forEach(el => {
        if (el.key.indexOf('points') !== -1 && el.enable) {
          obj[el.key] = {
            label: el.label,
            orderNo: el.orderNo
          };
        }
      });
      return obj;
    }
  },
  {}
);
export const customNavigation = handleActions(
  {
    [HANDLE_CUSTOM_MENU]: (state, { payload }) => payload
  },
  []
);

export const extraServiceData = handleActions(
  {
    [GET_EXTRA_SERVICE]: (state, { payload }) => payload
  },
  {}
);

export default combineReducers({
  userInfo,
  unreadMessage,
  languageSelectors,
  myIntroduceLink,
  tipsModalData,
  topAlertData,
  brandInfo,
  unreadModalMessage,
  loading,
  navigation,
  customNavigation,
  userRights,
  transparentMask,
  myLinkQrcode,
  phoneCallStatus,
  versionGuideKeys,
  bannerNoticeData,
  realeseNoticeData,
  topRights,
  personalRules,
  personalReportShow,
  objectList,
  productVasSwitch,
  usualReportList,
  versionRights,
  accessConfig,
  accountTypes,
  bwAccountShow,
  loginIpInfo,
  points,
  pointsMap,
  extraServiceData
});
