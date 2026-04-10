import { createAction } from 'redux-actions';
import { get, post, setHost } from 'utils/ajax';
import { setRSAPublicKey } from 'utils/encryption';
import { setTenantType } from 'utils/logStore';
import actionDebounce from 'utils/actionDebounce';
import {
  getBrandInfo as getBrandInfoFromCache,
  setBrandInfo as setBrandInfoToCache
} from 'utils/brandInfo';
import { logoutSessionStorage } from 'utils/sessionStorageShare';
import { setLoginPosition } from 'utils/loginPosition';
import {
  getCountry as getCountryData,
  saveCountry,
  getVersion as getCountryVersion,
  setVersion as setCountryVersion
} from 'utils/country';
import language from 'utils/language';
import {
  getUserInfo as getInfo,
  saveUserInfo as saveInfo,
  clearUserInfo
} from 'utils/userInfo';
import { saveCountryCode, getCountryCode } from 'utils/phoneCountryCode';
import { updateI18n } from 'utils/i18n';
import { getUserRight, saveUserRight } from 'utils/userRight';
import { injecteKey, getKeys, comfirmKey } from 'utils/versionGuide';
import { LANGUAGE_LOCAL_TO_API_KEY, LANGUAGE_CDN_URL } from 'utils/config';
import { saveBanks } from 'utils/banks';
const removeCountry = data => {
  const c = {
    7025: true,
    4184: true,
    4714: true,
    4715: true,
    4093: true,
    4094: true,
    3423: true,
    3424: true,
    4305: true,
    6766: true,
    3599: true,
    6765: true,
    5860: true,
    5861: true,
    4546: true,
    4547: true,
    4877: true,
    4878: true,
    4896: true,
    3885: true,
    3886: true,
    5997: true,
    5998: true,
    3433: true,
    6145: true,
    6110: true,
    6111: true,
    6695: true,
    6696: true,
    5176: true,
    6430: true,
    6431: true,
    5616: true,
    6742: true,
    6743: true,
    4676: true,
    4677: true,
    4574: true
  };
  return data.filter(item => !c[item.value]);
};
// ----------------------------------------------
// Action constans
// ----------------------------------------------

const PRE_FIX = 'GLOBAK_ACTIONS_';
export const GET_USER_INFO = `${PRE_FIX}GET_USER_INFO`;
export const UPDATE_USER_INFO = `${PRE_FIX}UPDATE_USER_INFO`;
export const GET_UNREAD_MESSAGE = `${PRE_FIX}GET_UNREAD_MESSAGE`;
export const GET_UNREAD_MODAL_MESSAGE = `${PRE_FIX}GET_UNREAD_MODAL_MESSAGE`;
export const GET_INTRODUCE_LINK = `${PRE_FIX}GET_INTRODUCE_LINK`;
export const GET_COUNTRYS = `${PRE_FIX}GET_COUNTRYS`;
export const GET_LANGUAGE = `${PRE_FIX}GET_LANGUAGE`;
export const GET_BANKS = `${PRE_FIX}GET_BANKS`;
export const GET_LANGUAGE_VERSION = `${PRE_FIX}GET_LANGUAGE_VERSION`;
export const SET_LANGUAGE_TYPE = `${PRE_FIX}SET_LANGUAGE_TYPE`;
export const SHOW_TIPS_MODAL = `${PRE_FIX}SHOW_TIPS_MODAL`;
export const CLOSE_TIPS_MODAL = `${PRE_FIX}CLOSE_TIPS_MODAL`;
export const SHOW_TOP_ALERT = `${PRE_FIX}SHOW_TOP_ALERT`;
export const CLOSE_TOP_ALERT = `${PRE_FIX}CLOSE_TOP_ALERT`;
export const SHOW_LOADING_BAR = `${PRE_FIX}SHOW_LOADING_BAR`;
export const CLOSE_LOADING_BAR = `${PRE_FIX}CLOSE_LOADING_BAR`;
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const GET_PHONE_COUNTRY_CODE = `${PRE_FIX}GET_PHONE_COUNTRY_CODE`;
export const GET_CURRENT_USER_RIGHT = `${PRE_FIX}GET_CURRENT_USER_RIGHT`;
export const MARK_MESSAGE_AS_READ = `${PRE_FIX}MARK_MESSAGE_AS_READ`;
export const MAKE_MODAL_MESSAGE_AS_READ = `${PRE_FIX}MAKE_MODAL_MESSAGE_AS_READ`;
export const SHOW_TRANSPARENT_MASK = `${PRE_FIX}SHOW_TRANSPARENT_MASK`;
export const CLOSE_TRANSPARENT_MASK = `${PRE_FIX}CLOSE_TRANSPARENT_MASK`;
export const GET_TODO_TASKS_COUNT = `${PRE_FIX}GET_TODO_TASKS_COUNT`;
export const LOGOUT = `${PRE_FIX}LOGOUT`;
export const GET_MY_LINK_QRCODE = `${PRE_FIX}GET_MY_LINK_QRCODE`;
export const PHONE_CALL_END = `${PRE_FIX}PHONE_CALL_END`;
export const PHONE_CALL_START = `${PRE_FIX}PHONE_CALL_START`;
export const INJECTE_VERSION_GUIDE_KEY = `${PRE_FIX}INJECTE_VERSION_GUIDE_KEY`;
export const COMFIRM_VERSION_GUIDE_KEY = `${PRE_FIX}COMFIRM_VERSION_GUIDE_KEY`;
export const SHOW_BANNER_NOTICE = `${PRE_FIX}SHOW_BANNER_NOTICE`;
export const CLOSE_BANNER_NOTICE = `${PRE_FIX}CLOSE_BANNER_NOTICE`;
export const CLOSE_REALESE_NOTICE = `${PRE_FIX}CLOSE_REALESE_NOTICE`;
export const CREATE_CONDITION = `${PRE_FIX}CREATE_CONDITION`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const REMOVE_CONDITION = `${PRE_FIX}REMOVE_CONDITION`;
export const GET_CUSTOMER_CONDITIONS = `${PRE_FIX}GET_CUSTOMER_CONDITIONS`;
export const GET_CONDITIONS_LIST_DETAIL = `${PRE_FIX}GET_CONDITIONS_LIST_DETAIL`;
export const SAVE_FORM_SORT_COLUMNS = `${PRE_FIX}SAVE_FORM_SORT_COLUMNS`;
export const GET_TOP_RIGHT = `${PRE_FIX}GET_TOP_RIGHT`;
export const GET_SYSTEM_SETTINGS = `${PRE_FIX}GET_SYSTEM_SETTINGS`;
export const GET_PERSONAL_RULE = `${PRE_FIX}GET_PERSONAL_RULE`;
export const SHOW_DIALOG = `${PRE_FIX}SHOW_DIALOG`;
export const GET_OBJECTS = `${PRE_FIX}GET_OBJECTS`;
export const GET_PRODUCT_VAS_SWITCH = `${PRE_FIX}GET_PRODUCT_VAS_SWITCH`;
export const GET_GIO_DATA = `${PRE_FIX}GET_GIO_DATA`;
export const GET_CUSTOM_REPORT_LIST = `${PRE_FIX}GET_CUSTOM_REPORT_LIST`;
export const BIND_CTID = `${PRE_FIX}BIND_CTID`;
export const GET_SIMPLEUSERS_LIST = `${PRE_FIX}GET_SIMPLEUSERS_LIST`;
export const SET_OR_CANCEL_USUAL_REPORT = `${PRE_FIX}SET_OR_CANCEL_USUAL_REPORT`;
export const INITIAL_USUAL_REPORT = `${PRE_FIX}INITIAL_USUAL_REPORT`;
export const GET_VERSION_RIGHTS = `${PRE_FIX}GET_VERSION_RIGHTS`;
export const GET_ACCESS_CONFIG = `${PRE_FIX}GET_ACCESS_CONFIG`;
export const GET_ACCOUNT_TYPE = `${PRE_FIX}GET_ACCOUNT_TYPE`;
export const UPDATE_LOGIN_IP_INFO = `${PRE_FIX}UPDATE_LOGIN_IP_INFO`;
export const GET_IP_LOCATION = `${PRE_FIX}GET_IP_LOCATION`;
export const GET_POINTS = `${PRE_FIX}GET_POINTS`;
export const GET_POINTS_FIELDS = `${PRE_FIX}GET_POINTS_FIELDS`;
export const GET_CUSTOM_MENU = `${PRE_FIX}GET_CUSTOM_MENU`;
export const HANDLE_CUSTOM_MENU = `${PRE_FIX}HANDLE_CUSTOM_MENU`;
export const GET_EXTRA_SERVICE = `${PRE_FIX}GET_EXTRA_SERVICE`;
export const GET_VERIFY_TYPE = `${PRE_FIX}GET_VERIFY_TYPE`;
// ----------------------------------------------
// Action creaters
// ----------------------------------------------

// 刷新开关,防止重复刷新
let __reloaded__ = false;

export const getGioData = createAction(GET_GIO_DATA, () =>
  get({
    url: '/v1/common/gio'
  })
);

// 获取用户信息
export const getUserInfo = createAction(GET_USER_INFO, () => {
  // try to get user info from session storage,
  // if faild get it from server.
  const info = getInfo();
  if (info) return Promise.resolve({ data: info, result: true });
  const promise = post({
    url: '/v1/user/currentUser'
  });
  // save user info into session storage.
  promise.then(({ result, data }) => {
    if (result) saveInfo(data);
  });
  return promise;
});

//测试数据
// const versionRights = {
//   SC_SECURITY_SET: true,
//   BW_CUSTOMER_GROUP: true,
//   BW_CUSTOMER_FOLLOW: true,
//   BW_ACCOUNT_GROUP: true,
//   SYSTEM_NOTICE_MOREMSG: true,
//   SYSTEM_REPOET_SUB: true,
//   test: true
// };
//获取版本权限
export const getVersionRights = createAction(GET_VERSION_RIGHTS, () =>
  get({
    url: '/v1/product/top/version/function'
  }).then(res => {
    if (!res.result) {
      return res;
    }
    const data = res.data.reduce((target, current) => {
      target[current] = true;
      return target;
    }, {});
    // const data = { ...versionRights };
    return { result: true, data };
  })
);

// 更新用户信息
export const updateUserInfo = createAction(UPDATE_USER_INFO, info => {
  const promise = post({
    url: '/v1/user/updateCurrentUser',
    data: info
  });
  // save user info into session storage.
  promise.then(({ result }) => {
    if (result) saveInfo(info);
  });

  return promise;
});

// 获取未读消息
export const getUnreadMessage = createAction(GET_UNREAD_MESSAGE, () =>
  post({
    url: '/v1/message/listUnRead',
    data: {
      queryType: 'INBOX', //必传
      type: 'WEB' //必传 WEB：系统消息
    }
  }).then(res => {
    if (!res.result) {
      return Promise.resolve(res);
    } else {
      return Promise.resolve({
        ...res,
        data: res.data.map(item => ({
          ...item,
          id: item.messageId,
          inId: item.inboxId
        }))
      });
    }
  })
);

//未读消息标记为已读
export const markMessageAsRead = createAction(
  MARK_MESSAGE_AS_READ,
  id => dispatch => {
    const p = post({
      url: '/v1/message/isRead',
      data: { id: [id] }
    });
    p.then(res => {
      if (!res.result) return Promise.resolve(res);
      dispatch(getUnreadMessage());
    });
    dispatch(p);
  }
);

// 获取未读弹窗消息
export const getUnreadModalMessage = createAction(
  GET_UNREAD_MODAL_MESSAGE,
  () =>
    post({
      url: '/v1/message/listUnRead',
      data: {
        queryType: 'INBOX', //必传
        type: 'WEB_ALERT' //必传 WEB：系统消息
      }
    }).then(res => {
      if (!res.result) {
        return Promise.resolve(res);
      } else {
        return Promise.resolve({
          ...res,
          data: res.data.map(item => ({
            ...item,
            id: item.messageId,
            inId: item.inboxId
          }))
        });
      }
    })
);

// 未读弹窗消息标记为已读
export const markModalMessageAsRead = createAction(
  MAKE_MODAL_MESSAGE_AS_READ,
  id =>
    post({
      url: '/v1/message/isRead',
      data: { id: [id] }
    }),
  () => ({ noMask: true })
);

// 获取我的推广链接
export const getIntroduceLink = createAction(GET_INTRODUCE_LINK, () =>
  get({
    url: '/v1/user/introduce/myIntroduces'
  })
);

const imgUrlReplaceToCdn = url => {
  if (!url) return '';
  let s = url.replace(
    /\/\/broker-upload\.oss-cn-hangzhou\.aliyuncs\.com/g,
    '//broker-upload.oss-cn-hangzhou.aliyuncs.com'
  );
  s = s.replace(
    /\/\/oss-cn-hangzhou\.aliyuncs\.com\/broker-upload/g,
    '//broker-upload.oss-cn-hangzhou.aliyuncs.com'
  );
  s = s.replace(/(http|https):/g, '');
  return s;
};
let brandInfoPromise = null;
// 获取我的配置信息
export const getBrandInfo = createAction(GET_BRAND_INFO, () => {
  if (!brandInfoPromise) {
    const brandInfoInCache = getBrandInfoFromCache();
    if (brandInfoInCache) {
      brandInfoPromise = Promise.resolve({
        result: true,
        data: brandInfoInCache
      });
    } else {
      brandInfoPromise = get({
        url: '/v1/product/brand'
      }).then(res => {
        const { result, data } = res;
        if (result) {
          // logo图片替换为cnd的域名
          data['productIcon'] = imgUrlReplaceToCdn(data['productIcon'] || '');
          data['productLogo'] = imgUrlReplaceToCdn(data['productLogo'] || '');
          data['background'] = imgUrlReplaceToCdn(data['background'] || '');
          // 品牌信息缓存到内存中
          setBrandInfoToCache(data);
        }
        return res;
      });
    }
  }
  return brandInfoPromise.then(res => {
    if (!res.result) return Promise.resolve(res);
    const { pubKey, tenantType, loginBoxPosition, themeId } = res.data;
    if (tenantType) setTenantType(tenantType);
    if (pubKey) setRSAPublicKey(pubKey);
    if (loginBoxPosition) setLoginPosition(loginBoxPosition);
    if (themeId) window.localStorage.setItem('THEME_ID', themeId);
    brandInfoPromise = null;
    return Promise.resolve(res);
  });
});

// 获取语言包
export const getLanguage = createAction(GET_LANGUAGE, () => {
  const languageType = language.getType();
  const languageKey = LANGUAGE_LOCAL_TO_API_KEY[languageType];
  return new Promise((resolve, reject) => {
    get({
      url: '/v1/static/version'
    }).then(res => {
      if (!res.result) return resolve(res);
      if (Number(res.data) <= Number(language.getVersion()))
        return resolve(res);
      language.setVersion(res.data);
      const version = res.data;
      get({
        url: `${LANGUAGE_CDN_URL}/${version}/${languageKey}_BW`
      }).then(v => {
        if (!v.result) return resolve(v);
        language.set(v.data);
        updateI18n();
        setTimeout(() => {
          if (__reloaded__) return;
          window.location.reload(true);
        }, 0);
        return resolve(v);
      });
    });
  });
});

const countryDataFilter = (enableCityObj, countryData) => {
  return countryData.filter(item => {
    return enableCityObj[item.value] || item.pid != 0;
  });
};
// 获取银行列表并缓存
export const getBanks = createAction(GET_BANKS, () => {
  return get({
    url: '/v1/tenants/metadata/field/option/t_account_finacial/bankAccount'
  }).then(rs => {
    if (rs.result) {
      saveBanks(rs.data);
      return Promise.resolve(rs);
    }
    return rs;
  });
});
// 获取国家信息
export const getCountry = createAction(GET_COUNTRYS, isRemove => {
  // get country data from local storage,
  // if faild get it from server.
  return get({
    url: '/v1/tenants/metadata/nation/version'
  }).then(version => {
    if (!version.result) {
      return Promise.resolve(version);
    }

    if (version.data == getCountryVersion() && getCountryData()) {
      return Promise.resolve(version);
    }

    setCountryVersion(version.data);

    return get({
      url: '/v1/tenants/metadata/nation'
    }).then(nation => {
      if (!nation.result) {
        return Promise.resolve(nation);
      }

      const enableCity = {};
      const phoneCountryCode = [];

      nation.data.forEach(city => {
        enableCity[city.id] = true;
        // if (city.code) {
        //   phoneCountryCode.push({
        //     label: city.value,
        //     value: `+${city.code}`
        //   });
        // }
      });

      //   saveCountryCode(phoneCountryCode);
      const languageKey = LANGUAGE_LOCAL_TO_API_KEY[language.getType()];
      const languageVersion = language.getVersion();
      return get({
        url: `${LANGUAGE_CDN_URL}/${languageVersion}/${languageKey}_CityAll`
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        let __data = [];
        res.data.forEach(item => {
          if (!enableCity[item.id] && item.pid == 0) return;
          __data.push({
            label: item.value,
            value: item.id,
            pid: item.pid
          });
        });
        if (isRemove) __data = removeCountry(__data);
        // save country data into local storage.
        saveCountry(__data);
        return Promise.resolve({
          ...res,
          data: __data
        });
      });
    });
  });
});

// 显示tipsModal
export const showTipsModal = createAction(SHOW_TIPS_MODAL, data => data);

// 显示tipsModal
export const showDialog = createAction(SHOW_DIALOG, data => data);

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

// 获取电话号码 国家代码
export const getPhoneCountryCode = createAction(GET_PHONE_COUNTRY_CODE, () => {
  const countryCodeData = getCountryCode();
  if (countryCodeData)
    return Promise.resolve({ data: countryCodeData, result: true });
  const promise = get({
    url: '/v1/tenants/metadata/field/option/countryCode'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    const __data = res.data.map(item => {
      return {
        ...item,
        value: `+${item.value}`
      };
    });
    console.log('data', __data);
    return Promise.resolve({
      ...res,
      data: __data
    });
  });
  promise.then(({ result, data }) => {
    if (result) saveCountryCode(data);
  });
  return promise;
});

// 获取当前用户的权限
export const getCurrentUserRight = createAction(
  GET_CURRENT_USER_RIGHT,
  () => {
    const userRights = getUserRight();
    if (userRights) return Promise.resolve({ data: userRights, result: true });
    const promise = post({
      url: '/v1/roleRight/role/USER/currentRight'
    });
    return promise.then(({ result, data, mcode }) => {
      let __d = data;
      if (result) __d = saveUserRight(data);
      return Promise.resolve({ result, data: __d, mcode });
    });
  },
  () => ({ noMask: true })
);

// 获取当前用户的一级权限
export const getTopRight = createAction(GET_TOP_RIGHT, id =>
  get({
    url: `/v1/roleRight/firstLevelRight`
  })
);

//刷新用户的权限
export const updateCurrentUserRight = createAction(
  GET_CURRENT_USER_RIGHT,
  () => {
    const promise = post({
      url: '/v1/roleRight/role/USER/currentRight'
    });
    return promise.then(({ result, data, mcode }) => {
      let __d = data;
      if (result) __d = saveUserRight(data);
      return Promise.resolve({ result, data: __d, mcode });
    });
  }
);

// 语言切换
export const setLanguageType = createAction(
  SET_LANGUAGE_TYPE,
  type => dispatch => {
    language.setType(type);
    get({ url: `/v1/user/language/${type}` })
      .then(res => {
        window.localStorage.setItem('DEFAULT_LANGUAGE_DATA', true);

        // 必须先清除sessetionStorage中的数据
        // 否则在getUserInfo这个action执行的时候,
        // 不会从服务器端获取新的UserInfo
        return Promise.resolve(clearUserInfo());
      })
      .then(() => {
        return Promise.resolve(dispatch(getLanguage()));
      });
  }
);

export const logout = createAction(LOGOUT, () =>
  post({
    url: '/v1/user/logout'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    // 清除浏览器当前标签页的sessionStorage
    window.sessionStorage.clear();
    // 清除其他浏览器标签页的sessionStorage
    logoutSessionStorage();
    return Promise.resolve(res);
  })
);

export const getMyLinkQrcode = createAction(GET_MY_LINK_QRCODE, id =>
  get({
    url: `/v1/user/introduce/${id}/qrcode/my`
  })
);

export const phoneCallEnd = createAction(PHONE_CALL_END, () => {});

export const phoneCallStart = createAction(PHONE_CALL_START, () => {});

export const injecteVersionGuideKey = createAction(
  INJECTE_VERSION_GUIDE_KEY,
  (userId, key) => dispatch => {
    dispatch({
      type: INJECTE_VERSION_GUIDE_KEY,
      payload: injecteKey(userId, key)
    });
  }
);

export const comfirmVersionGuideKey = createAction(
  COMFIRM_VERSION_GUIDE_KEY,
  (userId, key) => dispatch => {
    dispatch({
      type: COMFIRM_VERSION_GUIDE_KEY,
      payload: comfirmKey(userId, key)
    });
  }
);

// 显示BannerNotice信息
export const showBannerNotice = createAction(SHOW_BANNER_NOTICE, data => data);

// 隐藏BannerNotice
export const closeBannerNotice = createAction(CLOSE_BANNER_NOTICE);

// 隐藏realeseNotice
export const closeRealeseNotice = createAction(CLOSE_REALESE_NOTICE);
//创建条件
export const createCondition = createAction(CREATE_CONDITION, data =>
  post({
    url: '/v2/user/search/add',
    data: data
  })
);

//编辑条件
export const updateCondition = createAction(UPDATE_CONDITION, data =>
  post({
    url: '/v2/user/search/edit',
    data: data
  })
);

// 删除条件
export const removeCondition = createAction(REMOVE_CONDITION, id =>
  post({
    url: `/v2/user/search/delete/${id}`
  })
);

// 获取筛选条件
export const getConditions = createAction(
  GET_CUSTOMER_CONDITIONS,
  ({ searchType = '', searchLevel = '' }) =>
    get({
      url: `/v2/user/search/dropdown?searchType=${searchType}&searchLevel=${searchLevel}`
    })
);

//获取单条条件详情
export const getConditionsListDetail = createAction(
  GET_CONDITIONS_LIST_DETAIL,
  id =>
    get({
      url: `/v2/user/search/${id}`
    })
);
//提交排序内容
export const saveFormSortColumns = createAction(
  SAVE_FORM_SORT_COLUMNS,
  (userField, tablename) =>
    post({
      url: '/v1/user/fields/update',
      data: {
        tableName: tablename,
        userFields: userField
      }
    })
);

// 获取个人数据日报设置——控制个人通知选项是否存在
export const getSystemSettings = createAction(GET_SYSTEM_SETTINGS, () =>
  get({
    url: '/v1/notice/config/important/system/info'
  })
);

// 获取个人用户规则——控制个人通知选项是否存在
export const getPersonalRule = createAction(GET_PERSONAL_RULE, () =>
  get({
    url: '/v1/notice/config/important/personal/rules'
  })
);

// 获取任务项目列表
export const getObjects = createAction(
  GET_OBJECTS,
  actionDebounce(
    () => dispatch => {
      const payload = get({
        url: '/v1/tasks/view/tasksItemTab'
      });
      payload.then(() => {
        dispatch(getCurrentUserRight());
      });
      dispatch({
        type: GET_OBJECTS,
        payload,
        meta: {
          noMask: true
        }
      });
    },
    300
  ),
  () => ({ noMask: true })
);

//提交排序内容
export const getProductVasSwitch = createAction(GET_PRODUCT_VAS_SWITCH, () =>
  get({
    url: '/v1/product/vas/switch'
  })
);

//提交排序内容
export const getCustomReportList = createAction(GET_CUSTOM_REPORT_LIST, () =>
  get({
    url: '/v1/custom/report/config/menu'
  })
);
//绑定bindCtid
export const bindCtid = createAction(
  BIND_CTID,
  (account, ctid, { vendor, serverId }) =>
    post({
      url: `/v1/account/manage/bind/ctid`,
      data: {
        account,
        ctid
      },
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 获取查询用户列表
export const getSimpleUserList = createAction(
  GET_SIMPLEUSERS_LIST,
  (name, type) => {
    return get({
      url: `/v1/user/simpleUserByModuleRight?name=${name}&module=${type}`
    });
  },
  () => ({
    noMask: true
  })
);
export const setOrCancelUsual = createAction(
  SET_OR_CANCEL_USUAL_REPORT,
  data => data
);
export const initialUsualReportList = createAction(
  INITIAL_USUAL_REPORT,
  data => data
);
// 获取sc配置
export const getAccessConfig = createAction(GET_ACCESS_CONFIG, () => {
  return get({
    url: '/v1/user/login/access'
  });
});
// 获取账户类型
export const getAccountType = createAction(GET_ACCOUNT_TYPE, tenantId => {
  return get({
    url: `/v1/ops/tenants/accountType/config/${tenantId}`
  });
});

export const updateLoginIpInfo = createAction(
  UPDATE_LOGIN_IP_INFO,
  info => info
);

export const getIpLocation = createAction(GET_IP_LOCATION, ip => {
  return get({
    url: `/v1/common/ip/location?ip=${ip}`
  });
});

// 获取积分值
export const fetchPoints = createAction(GET_POINTS, id => {
  return get({
    url: `/v1/user/getUserPoints?id=${id}`
  });
});
// 获取积分字段
export const fetchPointsFields = createAction(GET_POINTS_FIELDS, id => {
  return get({
    url: `/v1/tenants/metadata/form-field/list?tableName=t_user_profiles`
  });
});
//获取自定义菜单栏
export const getCustomMenu = createAction(GET_CUSTOM_MENU, () => {
  return post({
    url: `/v1/product/menu/broker/list`
  });
});

export const handleCustomMenu = createAction(HANDLE_CUSTOM_MENU);

//获取增值服务金额
export const getExtraService = createAction(GET_EXTRA_SERVICE, () => {
  return get({
    url: '/v1/system/tenants/vas/alert'
  });
});
// 获取验证类型
export const getVerifyType = createAction(GET_VERIFY_TYPE, () => {
  return get({
    url: '/v1/tenants/metadata/verification/type'
  });
});
