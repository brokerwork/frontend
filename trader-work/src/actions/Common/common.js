import api from "@/api";
import { createAction } from "redux-actions";
import * as language from "@/utils/language";
import { updateI18n } from "@/utils/i18n";
import { setRSAPublicKey } from "@/utils/encryption";
import {
  ls,
  BRAND_INFO,
  DEFAULT_LANGUAGE_TYPE,
  USER_INFO
} from "@/utils/storage";
import {
  saveCountry,
  isCountryCodeExist,
  saveCountryCode,
  getCountryCode,
  isNationExist,
  saveNation
} from "@/utils/country";

export const COMMON_CHANGE_LANGUAGE = "COMMON_CHANGE_LANGUAGE";
export const COMMON_GET_COUNTRIES = "COMMON_GET_COUNTRIES";
export const COMMON_GET_MODULES = "COMMON_GET_MODULES";
export const COMMON_FETCH_BRAND_INFO = "COMMON_FETCH_BRAND_INFO";
export const COMMON_GET_LANGUAGE = "COMMON_GET_LANGUAGE";
export const COMMON_SHOW_LOADING = "COMMON_SHOW_LOADING";
export const COMMON_CLOSE_LOADING = "COMMON_CLOSE_LOADING";
export const COMMON_GET_COUNTRY_PHONE = "COMMON_GET_COUNTRY_PHONE";
export const COMMON_GET_LANGUAGEVERSION = "COMMON_GET_LANGUAGEVERSION";
export const COMMON_GET_COUNTRIESVERSION = "COMMON_GET_COUNTRIESVERSION";
export const COMMON_GET_NATIONS = "COMMON_GET_NATIONS";
export const COMMON_GET_UPLOADINFO = "COMMON_GET_UPLOADINFO";
export const COMMON_GET_VERSION = "COMMON_GET_VERSION";
export const COMMON_CHECK_TOKEN = "COMMON_CHECK_TOKEN";
export const COMMON_GET_PUBKEY = "COMMON_GET_PUBKEY";
export const COMMON_REFRESH_TOKEN = "COMMON_REFRESH_TOKEN";
export const COMMON_GET_NATION = "COMMON_GET_NATION";
export const COMMON_CONFIG_ACCESS = "COMMON_CONFIG_ACCESS";
export const COMMON_GET_FA_DATA = "COMMON_GET_FA_DATA";
export const COMMON_GET_ACCOUNT_DEMO_CHECK = "COMMON_GET_ACCOUNT_DEMO_CHECK";
export const COMMON_GET_ACCOUNT_TYPE_CONFIG = "COMMON_GET_ACCOUNT_TYPE_CONFIG";

export const getModules = createAction(COMMON_GET_MODULES, () =>
  api.get("/v1/config/version/modules")
);

//  刷新token
export const refreshToken = createAction(COMMON_REFRESH_TOKEN, () => {
  return api.get("/v1/user/token/refresh");
});

// 替换oss的链接为cdn的链接
const imgUrlReplaceToCdn = url => {
  if (!url) return "";
  let s = url.replace(
    "//broker-upload.oss-cn-hangzhou.aliyuncs.com",
    "//broker-upload.lwork.com"
  );
  s = s.replace(
    "//oss-cn-hangzhou.aliyuncs.com/broker-upload",
    "//broker-upload.lwork.com"
  );
  s = s.replace(/(http|https):/g, "");
  return s;
};

const positionHash = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center"
};
export const fetchBrandInfo = createAction(COMMON_FETCH_BRAND_INFO, () =>
  api.get("/v1/config/brand?productId=TW").then(res => {
    if (res.result) {
      const { data } = res;
      data["mobileLogo"] = imgUrlReplaceToCdn(data.mobileLogo);
      data["background"] = imgUrlReplaceToCdn(data.background);
      data["productIcon"] = imgUrlReplaceToCdn(data.productIcon);
      data["productLogo"] = imgUrlReplaceToCdn(data.productLogo);
      document.body.className = `theme-${data.themeId} theme-position-${
        positionHash[data.loginBoxPosition]
      }`;
      document.getElementById("iconLink").href = data.productIcon;
      document.getElementById("pageTitle").innerHTML = data.siteName;
      ls.setItem(BRAND_INFO, data);
    }
    return Promise.resolve(res);
  })
);

// 获取语言包(包括字段国际化和国家城市列表)
export const getLanguage = createAction(
  COMMON_GET_LANGUAGE,
  type => dispatch => {
    return api.get("/v1/static/version").then(res => {
      const currentVer = language.getLanguageVersion();
      const newVer = Number(res.data);
      if (!!currentVer && Number(currentVer) <= newVer) {
        return res;
      }
      language.setLanguageVersion(newVer);
      const type = language.getType().replace("-", "");
      Promise.all([
        api
          .get(
            `//broker-static.oss-cn-hangzhou.aliyuncs.com/${newVer}/${type}_TW`
          )
          .then(res1 => {
            if (res1.result) {
              language.set(res1.data);
              updateI18n();
            }
            return res;
          }),
        api
          .get(
            `//broker-static.oss-cn-hangzhou.aliyuncs.com/${newVer}/${type}_CityAll`
          )
          .then(res2 => {
            if (res2.result) {
              saveCountry(res2.data);
            }
            return res;
          })
      ]).then(rs => {
        if (rs.every(el => el.result == true)) {
          setTimeout(() => {
            window.location.reload(true);
          }, 0);
        }
      });
    });
  }
);

// 语言切换
export const setLanguageType = createAction(
  COMMON_CHANGE_LANGUAGE,
  type => dispatch => {
    api
      .post(`/v1/pub/user/language/${type}`)
      // .then(() => {
      // 	// 必须先清除sessetionStorage中的数据
      // 	// 否则在getUserInfo这个action执行的时候,
      // 	// 不会从服务器端获取新的UserInfo
      // 	return Promise.resolve(clearUserInfo());
      // })
      .then(() => {
        //如果传入了语言类型，则为语言切换
        ls.setItem(DEFAULT_LANGUAGE_TYPE, true);
        language.setType(type);
        return Promise.resolve(dispatch(getLanguage(type)));
      });
  }
);

//获取国家代码数据
export const getCountryPhone = createAction(COMMON_GET_COUNTRY_PHONE, () => {
  if (!isCountryCodeExist()) {
    return api
      .get("/v1/ops/tenants/metadata/field/option/countryCode")
      .then(res => {
        if (res.result) {
          saveCountryCode(res.data);
        }
        return Promise.resolve(res);
      });
  } else {
    return getCountryCode();
  }
});

//  获取国家地区数据
export const getNationData = createAction(COMMON_GET_NATION, () => {
  //if (!isNationExist()) {//此处不能直接用缓存，需要优化
  return api
    .get(`/v1/ops/tenants/nation?lang=${language.getType()}`)
    .then(res => {
      if (res && res.result) {
        saveNation(res.data);
      }
      return Promise.resolve(res);
    });
  // } else {
  //     let nationData = window.localStorage.getItem(COUNTRY_NATION_KEY) || '[]'
  //     return JSON.parse(nationData)
  // }
});
//获取上传阿里云身份验证
export const getUploadInfo = createAction(COMMON_GET_UPLOADINFO, tenantId => {
  // let randomstr = 'b4374ad0-ad9e-11e7-ac03-89b75a33cbb2' //
  let randomstr = Math.random()
    .toString(16)
    .substring(2);
  return api.get(
    `${window.location.origin}/ali/oss/signature?bucket=leanwork-fs&fid=${tenantId}/${randomstr}`
  );
});
// 校验当前token是否有效，依此重定向页面
export const checkToken = createAction(COMMON_CHECK_TOKEN, () =>
  api.get("/v1/user/token").then(res => Promise.resolve(res))
);

//获取当前系统版本号
export const getVersion = createAction(COMMON_GET_VERSION, () =>
  api.get("/release/info/ui")
);

//获取加密的公钥
export const getPubkey = createAction(COMMON_GET_PUBKEY, () =>
  api.get("/v1/config/pubkey").then(res => {
    if (res.result && res.data) {
      setRSAPublicKey(res.data);
    }
    return Promise.resolve(res);
  })
);
//  获取SC配置
export const configAccess = createAction(COMMON_CONFIG_ACCESS, () => {
  return api.get("/v1/config/access");
});
// 显示/隐藏顶层loading bar
export const showLoadingBar = createAction(COMMON_SHOW_LOADING);
export const closeLoadingBar = createAction(COMMON_CLOSE_LOADING);

// 获取fa设置数据
export const getFaData = createAction(COMMON_GET_FA_DATA, token =>
  api.get("/v1/tw/user/2fa/setting", null, token)
);
// 检测是否有模拟账户
export const getDemoAccountCheck = createAction(
  COMMON_GET_ACCOUNT_DEMO_CHECK,
  () => api.post("/v1/user/account/demo/check")
);
// 获取f账户类型数据
export const getAccountTypeConfig = createAction(
  COMMON_GET_ACCOUNT_TYPE_CONFIG,
  () => {
    const userInfo = ls.getItem(USER_INFO)||{};
    const tenantId = userInfo.locationInfo
      ? userInfo.locationInfo.tenantId
      : "";
    return api.get(`/v1/ops/tenants/accountType/config/${tenantId}`);
  }
);
