import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { getTenantId } from 'utils/tenantInfo';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'DASHBOARD_';
export const OFFLINE_RECHARGE = `${PRE_FIX}OFFLINE_RECHARGE`;
export const ONLINE_RECHARGE = `${PRE_FIX}ONLINE_RECHARGE`;
export const ENABLE_SERVICE = `${PRE_FIX}ENABLE_SERVICE`;
export const DISABLE_SERVICE = `${PRE_FIX}DISABLE_SERVICE`;
export const GET_EMAIL_SERVICE_INFO = `${PRE_FIX}GET_EMAIL_SERVICE_INFO`;
export const OPERATE_CONTACT = `${PRE_FIX}OPERATE_CONTACT`;
export const REMOVE_CONTACT = `${PRE_FIX}REMOVE_CONTACT`;
export const GET_EXCHANGE_RATE = `${PRE_FIX}GET_EXCHANGE_RATE`;
export const GET_VIDEO_SERVICE = `${PRE_FIX}GET_VIDEO_SERVICE`;
export const GET_VERI_CODE = `${PRE_FIX}GET_VERI_CODE`;
export const DEL_DATA = `${PRE_FIX}DEL_DATA`;
export const GET_VOUCHER_LIST = `${PRE_FIX}GET_VOUCHER_LIST`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const offlineRecharge = createAction(OFFLINE_RECHARGE, ({ bills, amount }) =>
  post({
    url: '/v2/os/tenants/recharge/remitting/bill',
    data: {
      bills,
      amount
    }
  })
);

export const onlineRecharge = createAction(ONLINE_RECHARGE, ({ providerId, amount }) =>
  post({
    url: '/v1/ops/tenants/payment/recharge/online',
    data: {
      providerId,
      amount
    }
  })
);

export const enableService = createAction(ENABLE_SERVICE, (type, email) =>
  post({
    url: `/v1/ops/product/vas/switch/on?type=${type.toUpperCase()}${
      email ? `&email=${email.email}&sender=${email.sender}` : ''
    }`
  })
);

export const disableService = createAction(DISABLE_SERVICE, type =>
  post({
    url: `/v1/ops/product/vas/switch/off?type=${type.toUpperCase()}`
  })
);

export const getEmailServiceInfo = createAction(GET_EMAIL_SERVICE_INFO, () =>
  get({
    url: '/v1/ops/product/vas/switch/email'
  })
);

export const operateContact = createAction(
  OPERATE_CONTACT,
  (tenantId, { contactsId, contactsName, email, phone, contactsType }) =>
    post({
      url: `/v1/ops/tenants/${tenantId}/contacts/upsert`,
      data: {
        contactsId,
        contactsName,
        email,
        phone,
        contactsType
      }
    })
);

export const removeContact = createAction(REMOVE_CONTACT, (tenantId, contactId) =>
  post({
    url: `/v1/ops/tenants/contacts/remove?tenantId=${tenantId}&contactId=${contactId}`
  })
);

export const getExchangeRate = createAction(GET_EXCHANGE_RATE, () =>
  get({
    url: '/v1/common/exchange/cache/CNY/USD'
  })
);

export const getVideoService = createAction(GET_VIDEO_SERVICE, () =>
  get({
    url: '/v2/os/products/video/overview'
  })
);

export const getVeriCode = createAction(GET_VERI_CODE, () =>
  get({
    url: '/v1/system/data/clear/verification/code'
  })
);

export const delData = createAction(DEL_DATA, code =>
  post({
    url: '/v1/system/data/clear',
    data: {
      verificationCode: code
    }
  })
);

export const getVoucherList = createAction(GET_VOUCHER_LIST, data =>
  post({
    url: '/v1/ops/tenants/coupon/send/page',
    data: { tenantId: getTenantId(), ...data }
  })
);
