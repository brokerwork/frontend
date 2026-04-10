import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import language from 'utils/language';
import { getTenantId } from 'utils/tenantInfo';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'BROKER_EMAIL_SETTING_';
export const GET_EMAIL_LIST = `${PRE_FIX}GET_EMAIL_LIST`;
export const GET_EMAIL_PROVIDER = `${PRE_FIX}GET_EMAIL_PROVIDER`;
export const CREATE_EMAIL = `${PRE_FIX}CREATE_EMAIL`;
export const REMOVE_EMAIL = `${PRE_FIX}REMOVE_EMAIL`;
export const SET_EMAIL_TARGET = `${PRE_FIX}SET_EMAIL_TARGET`;
export const UPDATE_EMAIL = `${PRE_FIX}UPDATE_EMAIL`;
export const GET_TEMPLATE_LIST = `${PRE_FIX}GET_TEMPLATE_LIST`;
export const GET_EMAIL_DEFAULT_LANGUAGE = `${PRE_FIX}GET_EMAIL_DEFAULT_LANGUAGE`;
export const UPDATE_EMAIL_DEFAULT_LANGUAGE = `${PRE_FIX}UPDATE_EMAIL_DEFAULT_LANGUAGE`;
export const SEND_TEST_EMAIL = `${PRE_FIX}SEND_TEST_EMAIL`;
export const STORE_SELECTED_TEMPLATE = `${PRE_FIX}STORE_SELECTED_TEMPLATE`;
export const BATCH_UPDATE_TEMPLATE_EMAIL = `${PRE_FIX}BATCH_UPDATE_TEMPLATE_EMAIL`;
export const GET_TEMPLATE_DETAIL = `${PRE_FIX}GET_TEMPLATE_DETAIL`;
export const UPDATE_TEMPLATE = `${PRE_FIX}UPDATE_TEMPLATE`;
export const GET_EMAIL_DEFAULT_TEMPLATE = `${PRE_FIX}GET_EMAIL_DEFAULT_TEMPLATE`;
// 获取新的邮件模板列表
export const GET_EMAIL_NEW_TEMPLATES_LIST = `${PRE_FIX}GET_EMAIL_NEW_TEMPLATES_LIST`;
// 批量重置邮件模板
export const BATCH_RESET_EMAIL_TEMPLATES = `${PRE_FIX}BATCH_RESET_EMAIL_TEMPLATES`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getEmailList = createAction(GET_EMAIL_LIST, () =>
  post({
    url: '/api/v1/message/config/list',
    data: {
      type: 'MAIL',
      level: 'TENANT',
      productId: 'BW'
    }
  }).then(res => ({
    ...res,
    // 避免返回的数据为空，导致代码报错的问题
    data: res.data || []
  }))
);

export const getEmailProvider = createAction(GET_EMAIL_PROVIDER, () =>
  get({
    url: '/api/v1/message/config/dropdown'
  })
);

export const createEmail = createAction(CREATE_EMAIL, email =>
  post({
    url: '/api/v1/message/config/add',
    data: {
      type: 'MAIL',
      level: 'TENANT',
      productId: 'BW',
      userId: 'SC',
      ...email
    }
  })
);

export const updateEmail = createAction(UPDATE_EMAIL, email =>
  post({
    url: '/api/v1/message/config/update',
    data: {
      ...email
    }
  })
);

export const removeEmail = createAction(REMOVE_EMAIL, configId =>
  post({
    url: '/api/v1/message/config/delete',
    data: {
      productId: 'BW',
      configId
    }
  })
);

export const _setEmailTarget = createAction(SET_EMAIL_TARGET, target => target);

export const getTemplateList = createAction(GET_TEMPLATE_LIST, type =>
  post({
    url: '/api/v1/message/template/list',
    data: {
      type: 'MAIL',
      level: 'TENANT',
      productId: 'BW',
      lang: language.getLang(),
      scene: type
    }
  })
);

export const getEmailDefaultLanguage = createAction(GET_EMAIL_DEFAULT_LANGUAGE, () =>
  get({
    url: '/v1/ops/product/mail/language',
    data: {
      productId: 'BW'
    }
  })
);

export const updateEmailDefalutLanguage = createAction(UPDATE_EMAIL_DEFAULT_LANGUAGE, lang =>
  get({
    url: '/v1/ops/product/mail',
    data: {
      productId: 'BW',
      tenantId: getTenantId(),
      language: lang
    }
  })
);

export const sendTestEmail = createAction(SEND_TEST_EMAIL, email =>
  post({
    url: '/api/v1/message/config/test',
    data: {
      productId: 'BW',
      level: 'TENANT',
      type: 'MAIL',
      userId: 'SC',
      templateType: 'BW_TEST_SMTP',
      ...email
    }
  })
);

export const _storeSelectedTemplate = createAction(STORE_SELECTED_TEMPLATE, data => data);

export const batchUpdateTemplateEmail = createAction(BATCH_UPDATE_TEMPLATE_EMAIL, (templateIds, configId) =>
  post({
    url: '/api/v1/message/template/setConfig',
    data: {
      templateIds,
      configId
    }
  })
);

export const getTemplateDetail = createAction(GET_TEMPLATE_DETAIL, type =>
  get({
    url: '/api/v1/message/template/details',
    data: {
      productId: 'BW',
      type,
      tenantId: getTenantId()
    }
  })
);

export const updateTemplate = createAction(UPDATE_TEMPLATE, template =>
  post({
    url: '/api/v1/message/template/update',
    data: template
  })
);

export const getEmailDefaultTemplate = createAction(GET_EMAIL_DEFAULT_TEMPLATE, (templateType, lang) =>
  post({
    url: '/api/v1/message/template/getDemo',
    data: {
      templateType,
      productId: 'BW',
      lang
    }
  })
);

export const getEmailNewTemplateList = createAction(GET_EMAIL_NEW_TEMPLATES_LIST, lang =>
  post({
    url: '/api/v1/message/template/getDemos',
    data: {
      productId: 'BW',
      lang
    }
  })
);

export const batchResetEmailTemplates = createAction(BATCH_RESET_EMAIL_TEMPLATES, ids =>
  post({
    url: '/api/v1/message/template/resetToDemo',
    data: ids
  })
);
