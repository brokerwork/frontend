import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { setBrandInfo as setBrandInfoToCache } from 'utils/brandInfo';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'AGENT_APPLY_';
export const GET_FORM_FIELDS = `${PRE_FIX}GET_FORM_FIELDS`;
export const GET_AGENT_CONFIG = `${PRE_FIX}GET_AGENT_CONFIG`;
export const GET_BRAND_INFO = `${PRE_FIX}GET_BRAND_INFO`;
export const SUBMIT_AGENT_INFO = `${PRE_FIX}SUBMIT_AGENT_INFO`;
export const GET_UPLOAD_SIGN = `${PRE_FIX}GET_UPLOAD_SIGN`;
export const GET_UPLOAD_SIGN_TOKEN = `${PRE_FIX}GET_UPLOAD_SIGN_TOKEN`;
export const CHECK_USER_INFO = `${PRE_FIX}CHECK_USER_INFO`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

const idFields = [
  'idType',
  'idNum',
  'idUrl1',
  'idUrl2',
  'bankAccount',
  'bankBranch',
  'accountNo',
  'bankCardFile1',
  'bankCardFile2'
];

// 获取代理表单字段
export const getFormField = createAction(GET_FORM_FIELDS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_user_agent'
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: {
        baseInfo: res.data.filter(item => !idFields.includes(item.key)),
        idInfo: res.data.filter(item => idFields.includes(item.key))
      }
    };
  })
);

export const getAgentConfig = createAction(GET_AGENT_CONFIG, () =>
  get({
    url: '/v1/tenants/metadata/agent/form'
  })
);

export const getBrandInfo = createAction(GET_BRAND_INFO, () =>
  get({
    url: '/v1/product/brand'
  }).then(res => {
    if (res.result) setBrandInfoToCache(res.data);
    return res;
  })
);

export const submitAgentInfo = createAction(SUBMIT_AGENT_INFO, data =>
  post({
    url: '/v1/custom/agencyRegister',
    data
  })
);

export const getUploadSign = createAction(GET_UPLOAD_SIGN, token =>
  get({
    url: `/v1/agent/register/signature?token=${token}`
  })
);

export const getUploadSignToken = createAction(
  GET_UPLOAD_SIGN_TOKEN,
  ({ captchaId, validate }) =>
    get({
      url: `/v1/agent/register/captcha/verify?captchaId=${captchaId}&validate=${validate}`
    })
);

export const checkUserInfo = createAction(CHECK_USER_INFO, data =>
  post({
    url: '/v1/user/existsForAgent',
    data
  })
);
