import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_COMMON_';
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const GET_PLAT_SETTING = `${PRE_FIX}GET_PLAT_SETTING`;
export const GET_PLAT_SETTING_V2 = `${PRE_FIX}GET_PLAT_SETTING_V2`;
export const SAVE_PLAT_SETTING_V2 = `${PRE_FIX}SAVE_PLAT_SETTING_V2`;
export const SAVE_PLAT_SETTING_BONUS = `${PRE_FIX}SAVE_PLAT_SETTING_BONUS`;
export const GET_LERERAGE_LIST = `${PRE_FIX}GET_LERERAGE_LIST`;
export const SAVE_PLAT_SETTING = `${PRE_FIX}SAVE_PLAT_SETTING`;
export const DO_SOME_OPERATION = `${PRE_FIX}DO_SOME_OPERATION`;
export const UPDATE_PAY_PLAT = `${PRE_FIX}UPDATE_PAY_PLAT`;
export const UPDATE_RATE_SETTING = `${PRE_FIX}UPDATE_RATE_SETTING`;
export const DELETE_RATE_SETTING = `${PRE_FIX}DELETE_RATE_SETTING`;
export const ADD_RATE_SETTING = `${PRE_FIX}ADD_RATE_SETTING`;
export const EXCHANGE_ORDER = `${PRE_FIX}EXCHANGE_ORDER`;
export const DELETE_ACCOUNT_TYPE = `${PRE_FIX}DELETE_ACCOUNT_TYPE`;
export const GET_FIELD_TYPE = `${PRE_FIX}GET_FIELD_TYPE`;
export const PAY_PLAT_SETTING_SORT = `${PRE_FIX}PAY_PLAT_SETTING_SORT`;
export const GET_MAX_LEVERAGE_LIST = `${PRE_FIX}GET_MAX_LEVERAGE_LIST`;
export const GET_ACCOUNT_TYPE_LIST = `${PRE_FIX}GET_ACCOUNT_TYPE_LIST`;
export const GET_TOTAL_CACULATION_TYPE_LIST = `${PRE_FIX}GET_TOTAL_CACULATION_TYPE_LIST`;
export const GET_PRODUCT_DETAIL = `${PRE_FIX}GET_PRODUCT_DETAIL`;
export const GET_PRODUCT_LIMIT = `${PRE_FIX}GET_PRODUCT_LIMIT`;
export const UPDATE_PUBLIC_KEY = `${PRE_FIX}UPDATE_PUBLIC_KEY`;
export const RESET_TOKEN = `${PRE_FIX}RESET_TOKEN`;
export const GET_ACCESS_SETTING = `${PRE_FIX}GET_ACCESS_SETTING`;
export const DO_SERVICE_SETTING = `${PRE_FIX}DO_SERVICE_SETTING`;
export const UPDATE_ACCESS_SETTING = `${PRE_FIX}UPDATE_ACCESS_SETTING`;
export const GET_RATE = `${PRE_FIX}GET_RATE`;
export const OPERATE_SYNC = `${PRE_FIX}OPERATE_SYNC`;
export const GET_CUSTOM_FIELDS = `${PRE_FIX}GET_CUSTOM_FIELDS`;
export const SAVE_WITHDRAW = `${PRE_FIX}SAVE_WITHDRAW`;
export const SWITCH_STATE = `${PRE_FIX}SWITCH_STATE`;
export const GET_ACCOUNT_TYPE_CONFIG = `${PRE_FIX}GET_ACCOUNT_TYPE_CONFIG`;
export const UPDATE_ACCOUNT_TYPE_CONFIG = `${PRE_FIX}UPDATE_ACCOUNT_TYPE_CONFIG`;
export const DELETE_ACCOUNT_TYPE_CONFIG = `${PRE_FIX}DELETE_ACCOUNT_TYPE_CONFIG`;
export const GET_RISK_DESC_DATA = `${PRE_FIX}GET_RISK_DESC_DATA`;
export const GET_OPEN_DESC_DATA = `${PRE_FIX}GET_OPEN_DESC_DATA`;
export const SAVE_OPEN_ACCOUNT_SETTING_DATA = `${PRE_FIX}SAVE_OPEN_ACCOUNT_SETTING_DATA`;
export const SWITCH = `${PRE_FIX}SWITCH`;
export const FETCH_USERS = `${PRE_FIX}FETCH_USERS`;
export const SAVE_USERS = `${PRE_FIX}SAVE_USERS`;
export const GET_SAME_ACCOUNT_SETTING_DATA = `${PRE_FIX}GET_SAME_ACCOUNT_SETTING_DATA`;
export const SAVE_SAME_ACCOUNT_SETTING_DATA = `${PRE_FIX}SAVE_SAME_ACCOUNT_SETTING_DATA`;
const WITHDRAW_SORT = `${PRE_FIX}WITHDRAW_SORT`;

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

export const getPlatSetting = createAction(GET_PLAT_SETTING, plat =>
  get({
    url: '/v1/ops/product/conf/structural',
    data: {
      structural: plat
    }
  })
);

//plat：MT4/MT5/CTRADER
export const getPlatformSetting = createAction(GET_PLAT_SETTING_V2, (plat, accountType) =>
  get({
    url: `/v2/os/products/conf/${plat}/form-fields${accountType ? `?accountType=${accountType}` : ''}`
  }).then(res => {
    if (!res.result) {
      return res;
    }
    const {
      data: { accountStepSettings = [], poolFieldList = [] }
    } = res;
    const steps = accountStepSettings.map(step => {
      const { fieldList, ...others } = step;
      return {
        ...others,
        fieldList: fieldList
          .map(item => ({ ...item, uuid: `${item.key}#${item.formName}` }))
          .filter(item => (!item.relation && item.relationFunc) || (!item.relation && !item.relationFunc))
      };
    });
    const poolList = poolFieldList
      .map(item => ({ ...item, name: item.label, uuid: `${item.key}#${item.formName}` }))
      .filter(item => (!item.relation && item.relationFunc) || (!item.relation && !item.relationFunc));
    return {
      data: {
        accountStepSettings: steps,
        poolFieldList: poolList
      },
      result: true
    };
  })
);

export const savePlatformSetting = createAction(SAVE_PLAT_SETTING_V2, (plat, data, accountType) =>
  post({
    url: `/v2/os/products/conf/${plat}/form-fields${accountType ? `?accountType=${accountType}` : ''}`,
    data
  })
);

export const savePlatSettingBonus = createAction(SAVE_PLAT_SETTING_BONUS, (plat, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/bonus`,
    data
  })
);
export const savePlatSetting = createAction(SAVE_PLAT_SETTING, (plat, type, data, newUrl) =>
  post({
    url: newUrl ? newUrl : `/v1/ops/product/conf/${plat}/${type}`,
    data
  })
);
//设置默认汇率 状态切换
export const doSomeOperation = createAction(DO_SOME_OPERATION, (plat, type, data) =>
  post({
    url: `/v2/os/products/conf/${plat}/exchange/${type}`,
    data
  })
);
//入金设置 支付平台设置 状态修改操作
export const updatePayPlat = createAction(UPDATE_PAY_PLAT, (plat, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/pay/plat`,
    data
  })
);

export const getLeverageList = createAction(GET_LERERAGE_LIST, (plat, data) =>
  get({
    url: `/v1/ops/tenants/metadata/field/option/leverage`,
    data
  })
);
export const getMaxLeverageList = createAction(GET_MAX_LEVERAGE_LIST, () =>
  get({
    url: `/v2/os/tenants/field/t_account_cbroker/maxLeverage/option`
  })
);
export const getAccountTypeList = createAction(GET_ACCOUNT_TYPE_LIST, () =>
  get({
    url: `/v2/os/tenants/field/t_account_cbroker/ctraderAccountType/option`
  })
);
export const getTotalCaculationTypeList = createAction(GET_TOTAL_CACULATION_TYPE_LIST, () =>
  get({
    url: `/v2/os/tenants/field/t_account_cbroker/totalMarginCalculationType/option`
  })
);
//删除汇率设置
export const deleteRateSetting = createAction(DELETE_RATE_SETTING, (plat, type, data) =>
  post({
    url: `/v2/os/products/conf/${plat}/${type}/exchange/delete`,
    data
  })
);
//新建汇率设置
export const addRateSetting = createAction(ADD_RATE_SETTING, (plat, type, data) =>
  post({
    url: `/v2/os/products/conf/${plat}/${type}/exchange/add`,
    data
  })
);
//编辑汇率设置
export const updateRateSetting = createAction(UPDATE_RATE_SETTING, (plat, type, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/${type}/exchange`,
    data
  })
);
// plat = MT4/MT5/CTRADER
// type = withdraw,deposit
// [
//   {"transactionCurrency":"CNY","payCurrency","USD"},
//   {"transactionCurrency":"CNY","payCurrency","USD"},
// ]
export const exchangeOrder = createAction(EXCHANGE_ORDER, (plat, type, data) =>
  post({
    url: `/v2/os/products/conf/${plat}/${type}/exchange/order`,
    data
  })
);

export const deleteAccountType = createAction(DELETE_ACCOUNT_TYPE, data =>
  post({
    url: `/v2/os/products/conf/remove/account-type`,
    data
  })
);

export const getFieldType = createAction(GET_FIELD_TYPE, () =>
  get({
    url: '/v1/ops/tenants/metadata/field/option/fieldType'
  })
);

/**
 * 支付平台设置 排序
 */
export const payPlatSettingSort = createAction(PAY_PLAT_SETTING_SORT, (plat, type, data) =>
  post({
    url: `/v2/os/products/conf/${plat}/${type}/order`,
    data
  })
);

export const getProductDetail = createAction(GET_PRODUCT_DETAIL, () =>
  get({
    url: '/v1/ops/product/detail',
    data: {
      productId: 'TW'
    }
  })
);

export const getProductLimit = createAction(GET_PRODUCT_LIMIT, tenantId =>
  get({
    url: '/v1/ops/product/limited',
    data: {
      productId: 'TW',
      tenantId
    }
  })
);

export const upPublicKey = createAction(UPDATE_PUBLIC_KEY, publicKey =>
  post({
    url: '/v1/ops/product/update/pub-key',
    data: {
      productId: 'TW',
      publicKey
    }
  })
);

export const resetToken = createAction(RESET_TOKEN, () =>
  post({
    url: '/v1/ops/product/token/reset?productId=TW'
  })
);

export const getAccessSetting = createAction(GET_ACCESS_SETTING, () =>
  get({
    url: '/v1/pub/config/access?productId=TW'
  })
);

export const doServiceSetting = createAction(DO_SERVICE_SETTING, () =>
  get({
    url: '/v1/pub/config/access?productId=TW'
  })
);

export const updateAccessSetting = createAction(UPDATE_ACCESS_SETTING, data =>
  post({
    url: '/v1/pub/config/access',
    data
  })
);
export const getRate = createAction(GET_RATE, (pay, transaction, source) =>
  get({
    url: `/v1/ops/product/exchange/rate/${pay}/${transaction}?source=${source}`
  })
);
export const operateSync = createAction(OPERATE_SYNC, (type, structural, fieldId) =>
  post({
    url: `/v2/os/products/conf/${type}/${structural}/field/${fieldId}`
  })
);
export const getCustomFields = createAction(GET_CUSTOM_FIELDS, () =>
  get({
    url: `/v1/ops/tenants/metadata/form-field?tableName=t_account_withdraw`
  })
);
// 保存出金设置
export const saveWithdraw = createAction(SAVE_WITHDRAW, (vendor, data) => {
  return post({
    url: `/v2/os/products/withdraw/way/${vendor}`,
    data
  });
});
// 启/禁用出金方式
export const switchState = createAction(SWITCH_STATE, (type, vendor, withdrawType, typeId) => {
  return post({
    url: `/v2/os/products/withdraw/way/${type}/${vendor}/${withdrawType}?typeId=${typeId}`
  });
});
// 获取多账户配置
export const getAccountTypeConfig = createAction(GET_ACCOUNT_TYPE_CONFIG, tenantId =>
  get({
    url: `/v1/ops/tenants/accountType/config/${tenantId}`
  })
);
// 编辑或新增多账户配置
export const updateAccountTypeConfig = createAction(UPDATE_ACCOUNT_TYPE_CONFIG, data => {
  return post({
    url: `/v1/ops/tenants/accountType/config/update`,
    data
  });
});
// 删除多账户配置
export const deleteAccountTypeConfig = createAction(DELETE_ACCOUNT_TYPE_CONFIG, customerAccountType =>
  post({
    url: `/v1/ops/tenants/accountType/config/remove/${customerAccountType}`
  })
);
// 获取开户设置 数据
export const getRiskDescData = createAction(GET_RISK_DESC_DATA, (structural, accountType) =>
  get({
    url: `/v2/os/products/conf/${structural}/risk-desc${accountType ? `?accountType=${accountType}` : ''}`
  })
);
export const getOpenDescData = createAction(GET_OPEN_DESC_DATA, (structural, accountType) =>
  get({
    url: `/v2/os/products/conf/${structural}/open-desc${accountType ? `?accountType=${accountType}` : ''}`
  })
);
// 提交开户设置 数据
export const saveOpenAccountSettingData = createAction(
  SAVE_OPEN_ACCOUNT_SETTING_DATA,
  (structural, type, data, accountType) =>
    post({
      url: `/v2/os/products/conf/${structural}/${type}${accountType ? `?accountType=${accountType}` : ''}`,
      data
    })
);
// 获取账户组
export const fetchUsers = createAction(FETCH_USERS, () => {
  return get({
    url: `/v2/os/config/user/group/info`
  });
});
// 设置入金账户组信息
export const saveAccountConfig = createAction(SAVE_USERS, (structural, data) => {
  return post({
    url: `/v2/os/products/conf/${structural}/pay/plat/group`,
    data
  });
});
// 获取同名账户设置数据
export const getSameAccountSettingData = createAction(GET_SAME_ACCOUNT_SETTING_DATA, structural =>
  get({
    url: `/v2/os/products/conf/${structural}/samea-account`
  })
);
// 保存同名账户设置数据
export const saveSameAccountSettingData = createAction(SAVE_SAME_ACCOUNT_SETTING_DATA, (structural, data) =>
  post({
    url: `/v2/os/products/conf/${structural}/samea-account`,
    data
  })
);
// 出金类型排序
export const withdrawTypeSort = createAction(WITHDRAW_SORT, (structural, data) => {
  return post({
    url: `/v2/os/products/withdraw/way/${structural}/order`,
    data
  });
});
