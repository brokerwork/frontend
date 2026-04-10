import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'BROKER_COMMON_';
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const GET_PRODUCT_DETAIL = `${PRE_FIX}GET_PRODUCT_DETAIL`;
export const GET_PRODUCT_LIMIT = `${PRE_FIX}GET_PRODUCT_LIMIT`;
export const UNLOCK = `${PRE_FIX}UNLOCK`;
export const RESET_TOKEN = `${PRE_FIX}RESET_TOKEN`;
export const CLEAR_DATA = `${PRE_FIX}CLEAR_DATA`;
export const SEND_CODE = `${PRE_FIX}SEND_CODE`;
export const GET_ACCESS_SETTING = `${PRE_FIX}GET_ACCESS_SETTING`;
export const UPDATE_ACCESS_SETTING = `${PRE_FIX}UPDATE_ACCESS_SETTING`;
export const CANCEL_AUTH = `${PRE_FIX}CANCEL_AUTH`;
export const RIGHT_FUNCTION = `${PRE_FIX}RIGHT_FUNCTION`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getBrandInfo = createAction(GET_BRAND_INFO, () =>
  get({
    url: '/v1/ops/product/conf/brand',
    data: {
      productId: 'BW'
    }
  })
);

export const getProductDetail = createAction(GET_PRODUCT_DETAIL, () =>
  get({
    url: '/v1/ops/product/detail',
    data: {
      productId: 'BW'
    }
  })
);

export const getProductLimit = createAction(GET_PRODUCT_LIMIT, tenantId =>
  get({
    url: '/v1/ops/product/limited',
    data: {
      productId: 'BW',
      tenantId
    }
  })
);
export const unlockUser = createAction(UNLOCK, (pubUserId, email) =>
  post({
    url: `/v1/common/bw/user/enable/${pubUserId}`,
    data: {
      email
    }
  })
);

export const resetToken = createAction(RESET_TOKEN, () =>
  post({
    url: '/v1/ops/product/token/reset?productId=BW'
  })
);

export const clearData = createAction(CLEAR_DATA, code =>
  post({
    url: '/v1/system/data/clear',
    data: {
      verificationCode: code
    }
  })
);

export const sendCode = createAction(SEND_CODE, type =>
  get({
    url: `/v1/system/data/${type}/verification/code`
  })
);

export const getAccessSetting = createAction(GET_ACCESS_SETTING, () =>
  get({
    url: '/v1/pub/config/access?productId=BW'
  })
);

export const updateAccessSetting = createAction(UPDATE_ACCESS_SETTING, data =>
  post({
    url: '/v1/pub/config/access',
    data
  })
);

export const cancelAuth = createAction(CANCEL_AUTH, pubUserId =>
  post({
    url: `/v1/ops/product/disable/admin/2fa/${pubUserId}`
  })
);

export const rightFunction = createAction(RIGHT_FUNCTION, () =>
  get({
    url: `/v2/os/products/top/version/function`
  })
);