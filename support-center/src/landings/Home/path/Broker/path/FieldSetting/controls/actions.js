import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { MODULE_NAME } from '../constant';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'BROKER_FIELD_SETTING_';
export const GET_FIELD_LIST = `${PRE_FIX}GET_FIELD_LIST`;
export const GET_FIELD_TYPE = `${PRE_FIX}GET_FIELD_TYPE`;
export const UPDATE_FIELD = `${PRE_FIX}UPDATE_FIELD`;
export const GET_NATION_LIST = `${PRE_FIX}GET_NATION_LIST`;
export const UPDATE_NATION_STATUS = `${PRE_FIX}UPDATE_NATION_STATUS`;
export const GET_AGENT_INFO = `${PRE_FIX}GET_AGENT_INFO`;
export const UPDATE_AGENT_INFO = `${PRE_FIX}UPDATE_AGENT_INFO`;
export const SET_NATION_DEFAULT = `${PRE_FIX}SET_NATION_DEFAULT`;
export const CLEAR_NATION_DEFAULT = `${PRE_FIX}CLEAR_NATION_DEFAULT`;
export const SET_FIELD_ORDER_NO = `${PRE_FIX}SET_FIELD_ORDER_NO`;
export const GET_FIELD_MODULE = `${PRE_FIX}GET_FIELD_MODULE`;
export const UPDATE_MODULE = `${PRE_FIX}UPDATE_MODULE`;
export const GET_QUESTION_SUMMARY = `${PRE_FIX}GET_QUESTION_SUMMARY`;
export const OPERATE_QUESTION = `${PRE_FIX}OPERATE_QUESTION`;
export const GET_DEFAUL_QUESTION_LIST = `${PRE_FIX}GET_DEFAUL_QUESTION_LIST`;
export const TOGGLE_QUESTION_SUMMARY_STATUS = `${PRE_FIX}TOGGLE_QUESTION_SUMMARY_STATUS`;
export const UPDATE_QUESTION = `${PRE_FIX}UPDATE_QUESTION`;
export const SET_QUESTION_SEQUENCE = `${PRE_FIX}SET_QUESTION_SEQUENCE`;
export const GET_TEST_RESULT = `${PRE_FIX}GET_TEST_RESULT`;
export const UPDATE_TEST_RESULT = `${PRE_FIX}UPDATE_TEST_RESULT`;
export const STORE_RESULT_SCORE = `${PRE_FIX}STORE_RESULT_SCORE`;
export const CREATE_CUSTOMIZE_FIELD = `${PRE_FIX}CREATE_CUSTOMIZE_FIELD`;
export const UPDATE_CUSTOMIZE_FIELD = `${PRE_FIX}UPDATE_CUSTOMIZE_FIELD`;
export const REMOVE_CUSTOMIZE_FIELD = `${PRE_FIX}REMOVE_CUSTOMIZE_FIELD`;
export const DISABLE_FIELD = `${PRE_FIX}DISABLE_FIELD`;
export const ENABLE_FIELD = `${PRE_FIX}ENABLE_FIELD`;
export const BROKER_CONFIG_LANGUAGES = `${PRE_FIX}BROKER_CONFIG_LANGUAGES`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getFieldType = createAction(GET_FIELD_TYPE, () =>
  get({
    url: '/v1/ops/tenants/metadata/field/option/fieldType'
  })
);

export const getFieldList = createAction(GET_FIELD_LIST, tableName =>
  get({
    url: '/v1/ops/tenants/metadata/form-field',
    data: {
      tableName
    }
  })
);

export const updateField = createAction(UPDATE_FIELD, field =>
  post({
    url: '/v1/ops/tenants/metadata/form-field/upsert',
    data: field
  })
);

export const getNationList = createAction(GET_NATION_LIST, (key = '', page = 1, pageSize = 20) =>
  get({
    url: '/v1/ops/tenants/nation/page',
    data: {
      key,
      page,
      pageSize
    }
  })
);

export const updateNationStatus = createAction(UPDATE_NATION_STATUS, (status, id) => {
  return post({
    url: `/v1/ops/tenants/nation/${status}/${id}`
  }).then(res => {
    if (!res.result) Promise.resolve(res);

    return Promise.resolve({
      ...res,
      data: {
        id
      }
    });
  });
});

export const getAgentInfo = createAction(GET_AGENT_INFO, () =>
  get({
    url: '/v1/ops/tenants/agent/form/sc'
  })
);

export const updateAgentInfo = createAction(UPDATE_AGENT_INFO, info =>
  post({
    url: '/v1/ops/tenants/agent/form',
    data: info
  })
);

export const setNationDefault = createAction(SET_NATION_DEFAULT, nationId => {
  return post({
    url: `/v1/ops/tenants/nation/default/${nationId}`
  }).then(res => {
    if (!res.result) Promise.resolve(res);

    return Promise.resolve({
      ...res,
      data: {
        id: nationId
      }
    });
  });
});

export const clearNationDefault = createAction(CLEAR_NATION_DEFAULT, () =>
  post({
    url: '/v1/ops/tenants/nation/clear/default'
  })
);

export const setFieldOrderNo = createAction(SET_FIELD_ORDER_NO, (formId, origin, dest) =>
  post({
    // formId表单 origin 要排序字段的orderNo dest 目标字段的orderNo
    url: `/v2/os/tenants/field/turn/${formId}/${origin}/${dest}`
  })
);

export const getQuestionSummary = createAction(GET_QUESTION_SUMMARY, () =>
  get({
    url: '/v2/os/tenants/question'
  })
);

export const toggleQuestionSummaryStatus = createAction(TOGGLE_QUESTION_SUMMARY_STATUS, status =>
  post({
    url: `/v2/os/tenants/question/${status ? 'enable' : 'disable'}`
  })
);

export const getDefaultQuesionList = createAction(GET_DEFAUL_QUESTION_LIST, () =>
  get({
    url: '/v2/os/tenants/question/default'
  })
);

export const operateQuestion = createAction(OPERATE_QUESTION, (id, action) =>
  post({
    url: `/v2/os/tenants/question/${id}/${action}`
  })
);

export const getFieldModule = createAction(GET_FIELD_MODULE, moduleName =>
  get({
    url: `/v2/os/tenants/form/setting/${moduleName}`
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: res.data.map(item => {
        return {
          ...item,
          name: MODULE_NAME[item.form]
        };
      })
    };
  })
);

export const updateModule = createAction(UPDATE_MODULE, (moduleName, data) =>
  post({
    url: `/v2/os/tenants/form/setting/${moduleName}`,
    data
  })
);

export const updateQuestion = createAction(UPDATE_QUESTION, data =>
  post({
    url: '/v2/os/tenants/question',
    data
  })
);

export const setQuestionSequence = createAction(SET_QUESTION_SEQUENCE, sequence =>
  post({
    url: '/v2/os/tenants/question/sort',
    data: sequence
  })
);

export const getTestResult = createAction(GET_TEST_RESULT, () =>
  get({
    url: '/v2/os/tenants/question/result'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: {
        ...res.data,
        results: res.data.results || [{}, {}, {}, {}]
      }
    };
  })
);

export const updateTestResult = createAction(UPDATE_TEST_RESULT, data =>
  post({
    url: '/v2/os/tenants/question/result',
    data
  })
);

export const storeResultScore = createAction(STORE_RESULT_SCORE, data => data);

export const createCustomizeField = createAction(CREATE_CUSTOMIZE_FIELD, data =>
  post({
    url: '/v2/os/tenants/field/user/custom/add',
    data
  })
);

export const updateCustomizeField = createAction(UPDATE_CUSTOMIZE_FIELD, data =>
  post({
    url: '/v1/ops/tenants/metadata/form-field/upsert',
    data
  })
);

export const removeCustomizeField = createAction(REMOVE_CUSTOMIZE_FIELD, (fieldId, formId) =>
  post({
    url: `/v2/os/tenants/field/user/custom/delete?fieldId=${fieldId}&formId=${formId}`
  })
);

export const disableField = createAction(DISABLE_FIELD, (fieldId, formId) =>
  post({
    url: `/v2/os/tenants/field/user/custom/disable?fieldId=${fieldId}&formId=${formId}`
  })
);

export const enableField = createAction(ENABLE_FIELD, (fieldId, formId) =>
  post({
    url: `/v2/os/tenants/field/user/custom/enable?fieldId=${fieldId}&formId=${formId}`
  })
);
