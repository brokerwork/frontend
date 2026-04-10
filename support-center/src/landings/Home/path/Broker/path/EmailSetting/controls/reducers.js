import { handleActions } from 'redux-actions';
import { EMAIL_PROVIDER, SECURITY_TYPE } from '../constant';
import language from 'utils/language';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_EMAIL_LIST,
  GET_EMAIL_PROVIDER,
  SET_EMAIL_TARGET,
  GET_TEMPLATE_LIST,
  GET_EMAIL_DEFAULT_LANGUAGE,
  STORE_SELECTED_TEMPLATE,
  GET_TEMPLATE_DETAIL,
  GET_EMAIL_NEW_TEMPLATES_LIST,
  GET_EMAIL_DEFAULT_TEMPLATE
} from './actions';

// 重置邮件模板时需要覆盖的字段数据
export const templateRecoveryFields = ['name', 'title', 'content', 'params', 'desc', 'scene'];
// ---------------------------------------------
// reducers
// ---------------------------------------------

export const emailList = handleActions(
  {
    [GET_EMAIL_LIST]: (state, { payload }) => payload
  },
  []
);

export const templateEmailList = handleActions(
  {
    [GET_EMAIL_LIST]: (state, { payload }) => {
      return payload.map(item => {
        return {
          label: `${item.from} (${item.fromName})`,
          value: item.configId
        };
      });
    }
  },
  []
);

export const emailProvider = handleActions(
  {
    [GET_EMAIL_PROVIDER]: (state, { payload }) => {
      const copyData = [].concat(state);
      const result = [];

      copyData.forEach(item => {
        if (item.default) {
          result.push(item);
        }

        const existItem = payload.find(_item => _item.provider === item.value);

        if (existItem) {
          result.push({
            ...item,
            ...existItem
          });
        }
      });

      return result;
    }
  },
  EMAIL_PROVIDER
);

export const securityType = handleActions({}, SECURITY_TYPE);

export const emailTarget = handleActions(
  {
    [SET_EMAIL_TARGET]: (state, { payload }) => payload
  },
  {}
);

export const templateList = handleActions(
  {
    [GET_TEMPLATE_LIST]: (state, { payload }) => payload
  },
  []
);

export const emailDefaultLanguage = handleActions(
  {
    [GET_EMAIL_DEFAULT_LANGUAGE]: (state, { payload }) => payload
  },
  language.getLang()
);

export const selectedTemplate = handleActions(
  {
    [STORE_SELECTED_TEMPLATE]: (state, { payload }) => payload
  },
  []
);

export const templateDetail = handleActions(
  {
    [GET_TEMPLATE_DETAIL]: (state, { payload }) => payload,
    [GET_EMAIL_DEFAULT_TEMPLATE]: (state, { payload }) => {
      // 筛选需要覆盖的参数
      let recovery = {};
      templateRecoveryFields.map(key => {
        recovery[key] = payload[key];
      });
      // 对当前选中语言的数据进行更新
      state[payload.lang] = {
        ...state[payload.lang],
        ...recovery
      };
      return state;
    }
  },
  {}
);

export const newTemplateList = handleActions(
  {
    [GET_EMAIL_NEW_TEMPLATES_LIST]: (state, { payload }) => payload
  },
  []
);
