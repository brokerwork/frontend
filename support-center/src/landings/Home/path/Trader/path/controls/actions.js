import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_COMMON_';
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const GET_PLAT_SETTING = `${PRE_FIX}GET_PLAT_SETTING`;
export const SAVE_PLAT_SETTING_BONUS = `${PRE_FIX}SAVE_PLAT_SETTING_BONUS`;
export const GET_LERERAGE_LIST = `${PRE_FIX}GET_LERERAGE_LIST`;
export const SAVE_PLAT_SETTING = `${PRE_FIX}SAVE_PLAT_SETTING`;
export const DO_SOME_OPERATION = `${PRE_FIX}DO_SOME_OPERATION`;
export const UPDATE_PAY_PLAT = `${PRE_FIX}UPDATE_PAY_PLAT`;
export const UPDATE_RATE_SETTING = `${PRE_FIX}UPDATE_RATE_SETTING`;
export const EDIT_OPERATION = `${PRE_FIX}EDIT_OPERATION`;
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

export const savePlatSettingBonus = createAction(SAVE_PLAT_SETTING_BONUS, (plat, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/bonus`,
    data
  })
);
export const savePlatSetting = createAction(SAVE_PLAT_SETTING, (plat, type, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/${type}`,
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
//编辑
export const editOperation = createAction(EDIT_OPERATION, (plat, type, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/${type}/exchange`,
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

//编辑汇率设置
export const updateRateSetting = createAction(UPDATE_RATE_SETTING, (plat, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/deposit/exchange`,
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

export const updateAccessSetting1 = createAction(UPDATE_ACCESS_SETTING, data =>
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

