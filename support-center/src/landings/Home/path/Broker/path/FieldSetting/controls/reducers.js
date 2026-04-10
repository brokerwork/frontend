import { handleActions } from "redux-actions";
import language from "utils/language";
import {languages} from "utils/config";
import i18n from "utils/i18n";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_FIELD_TYPE,
  GET_FIELD_LIST,
  GET_NATION_LIST,
  UPDATE_NATION_STATUS,
  GET_AGENT_INFO,
  SET_NATION_DEFAULT,
  CLEAR_NATION_DEFAULT,
  SET_FIELD_ORDER_NO,
  GET_FIELD_MODULE,
  GET_QUESTION_SUMMARY,
  GET_DEFAUL_QUESTION_LIST,
  GET_TEST_RESULT,
  STORE_RESULT_SCORE,
  BROKER_CONFIG_LANGUAGES
} from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

const currentLang = language.getLang();

export const fieldType = handleActions(
  {
    [GET_FIELD_TYPE]: (state, { payload }) => payload
  },
  []
);

const fieldListFilter = payload => {
  let sorted = payload.filter(item => item.enable).sort((a, b) => {
    return a.orderNo - b.orderNo;
  });
  const related = [];

  sorted = sorted.map(item => {
    if (item.options) {
      item.options = item.options.map(option => {
        if (option.relationField) {
          related.push(option.relationField);
          option["relationFieldForList"] = sorted.find(
            sortedItem => sortedItem.fieldId === option.relationField
          );
        }

        return option;
      });
    }

    return item;
  });

  return sorted.filter(item => !related.includes(item.fieldId));
};

const notEnabledFieldFilter = payload => {
  return payload.filter(item => !item.enable).map((item, idx) => {
    return {
      label: item.message[currentLang],
      value: item.fid,
      ...item
    };
  });
};

export const fieldList = handleActions(
  {
    [GET_FIELD_LIST]: (state, { payload }) => fieldListFilter(payload),
    [SET_FIELD_ORDER_NO]: (state, { payload }) => fieldListFilter(payload)
  },
  []
);

export const notEnabledField = handleActions(
  {
    [GET_FIELD_LIST]: (state, { payload }) => notEnabledFieldFilter(payload),
    [SET_FIELD_ORDER_NO]: (state, { payload }) => notEnabledFieldFilter(payload)
  },
  []
);

export const nationList = handleActions(
  {
    [GET_NATION_LIST]: (state, { payload }) => payload,
    [UPDATE_NATION_STATUS]: (state, { payload }) => {
      const copyData = JSON.parse(JSON.stringify(state));

      return {
        ...state,
        list: copyData.list.map(item => {
          return {
            ...item,
            enable: item.id === payload.id ? !item.enable : item.enable
          };
        })
      };
    },
    [SET_NATION_DEFAULT]: (state, { payload }) => {
      const copyData = JSON.parse(JSON.stringify(state));

      return {
        ...state,
        list: copyData.list.map(item => {
          return {
            ...item,
            defaulted: item.id === payload.id
          };
        })
      };
    },
    [CLEAR_NATION_DEFAULT]: (state, { payload }) => {
      const copyData = JSON.parse(JSON.stringify(state));

      return {
        ...state,
        list: copyData.list.map(item => {
          return {
            ...item,
            defaulted: false
          };
        })
      };
    }
  },
  { list: [] }
);

export const agentInfo = handleActions(
  {
    [GET_AGENT_INFO]: (state, { payload }) => {
      const result = {};

      payload.forEach(item => {
        result[item.language] = item;
      });

      return result;
    }
  },
  {}
);

export const moduleList = handleActions(
  {
    [GET_FIELD_MODULE]: (state, { payload }) => payload
  },
  []
);

export const questionSummary = handleActions(
  {
    [GET_QUESTION_SUMMARY]: (state, { payload }) => payload
  },
  {
    enable: false,
    questions: []
  }
);

export const defaultQuestionList = handleActions(
  {
    [GET_DEFAUL_QUESTION_LIST]: (state, { payload }) => payload
  },
  []
);

export const notEnabledQuestionList = handleActions(
  {
    [GET_DEFAUL_QUESTION_LIST]: (state, { payload }) => {
      const list = payload.map(item => {
        return {
          ...item,
          label: item.subject[currentLang],
          value: item.id
        };
      });

      list.unshift({
        label: i18n["general.customize"],
        value: -1,
        options: [{}, {}, {}, {}]
      });

      return list;
    }
  },
  []
);

export const testResult = handleActions(
  {
    [GET_TEST_RESULT]: (state, { payload }) => payload
  },
  {}
);

export const resultScore = handleActions(
  {
    [STORE_RESULT_SCORE]: (state, { payload }) => payload
  },
  {
    maxScore: 0,
    minScore: 0
  }
);

// relationFunc 开启关联功能
// relation 被关联
// enable 启用
const relationFieldListFilter = payload => {
  return payload
    .filter(item => !item.sysDefault)
    .sort((a, b) => {
      return a.orderNo - b.orderNo;
    })
    .map(item => {
      return {
        label: `（${
          item.relationFunc || item.relation ? i18n['broker.field_setting.have_relation'] : item.enable ? i18n['broker.field_setting.have_use'] : i18n['broker.field_setting.not_use']
        }）${item.message[currentLang] || ''}`,
        value: item.fieldId,
        ...item
      };
    });
};

export const relationFieldList = handleActions(
  {
    [GET_FIELD_LIST]: (state, { payload }) => relationFieldListFilter(payload),
    [SET_FIELD_ORDER_NO]: (state, { payload }) =>
      relationFieldListFilter(payload)
  },
  []
);
