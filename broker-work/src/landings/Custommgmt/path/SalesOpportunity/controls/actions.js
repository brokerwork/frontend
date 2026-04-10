import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { showTipsModal } from 'commonActions/actions';
// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CUSTOMERMGMT_OPPORTUNITY';
export const GET_LIST_COLUMNS = `${PRE_FIX}GET_LIST_COLUMNS`;
export const GET_FORM_COLUMNS = `${PRE_FIX}GET_FORM_COLUMNS`;
export const GET_OPPORTUNITY_LIST = `${PRE_FIX}GET_OPPORTUNITY_LIST`;
export const GET_DETAIL = `${PRE_FIX}GET_DETAIL`;
export const REMOVE = `${PRE_FIX}REMOVE`;
export const CREATE_OPPORTUNITY = `${PRE_FIX}CREATE_OPPORTUNITY`;
export const UPDATE_OPPORTUNITY = `${PRE_FIX}UPDATE_OPPORTUNITY`;
export const GET_OPPORTUNITY_TYPE_LIST = `${PRE_FIX}GET_OPPORTUNITY_TYPE_LIST`;
export const GET_LOSE_CAUSE_LIST = `${PRE_FIX}GET_LOSE_CAUSE_LIST`;
export const GET_FOLLOW_WAY_LIST = `${PRE_FIX}GET_FOLLOW_WAY_LIST`;
export const UPDATE_SALES_STAGE = `${PRE_FIX}UPDATE_SALES_STAGE`;
export const UPDATE_FOLLOW_RECORD = `${PRE_FIX}UPDATE_FOLLOW_RECORD`;
export const GET_SALES_STAGE_LIST = `${PRE_FIX}GET_SALES_STAGE_LIST`;
export const GET_SEARCH_TYPE_LIST = `${PRE_FIX}GET_SEARCH_TYPE_LIST`;
export const UPDATE_CURRENT_SALES_STAGE = `${PRE_FIX}UPDATE_CURRENT_SALES_STAGE`;
export const UPDATE_CURRENT_FILTER_TYPE = `${PRE_FIX}UPDATE_CURRENT_FILTER_TYPE`;
export const UPDATE_CURRENT_SEARCH_TYPE = `${PRE_FIX}UPDATE_CURRENT_SEARCH_TYPE`;
export const UPDATE_CURRENT_PAGINATION = `${PRE_FIX}UPDATE_CURRENT_PAGINATION`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const UPDATE_SELECTEDS = `${PRE_FIX}UPDATE_SELECTEDS`;
export const GET_CUSTOMER_PARTICIPANT = `${PRE_FIX}GET_CUSTOMER_PARTICIPANT`;
export const GET_IS_LOST_CUSTOMER = `${PRE_FIX}GET_IS_LOST_CUSTOMER`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

import { SALES_OPPORTUNITY_SEARCH_TYPE } from '../constant';

export const getListColumns = createAction(GET_LIST_COLUMNS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/simple',
    data: {
      tableName: 't_customer_sales_opportunities'
    }
  })
);

export const getFormColumns = createAction(GET_FORM_COLUMNS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_customer_sales_opportunities'
    }
  })
);

export const getOpportunityList = createAction(
  GET_OPPORTUNITY_LIST,
  ({
    currentPage,
    pageSize,
    advanceConditions = [],
    fuzzyVal,
    enabled = true
  }) => dispatch => {
    dispatch({
      type: GET_OPPORTUNITY_LIST,
      payload: post({
        url: '/v2/custom/opp/opportunity/list',
        data: {
          currentPage,
          pageSize,
          advanceConditions,
          enabled,
          fuzzyVal
        }
      }).then(res => {
        if (res.result) {
          dispatch({
            type: UPDATE_UPDATE_TIME,
            payload: res.time
          });
        }
        return Promise.resolve(res);
        s;
      })
    });
  }
);

export const getSalesStageList = createAction(GET_SALES_STAGE_LIST, () => {
  return get({
    url: '/v1/tenants/metadata/field/option/salesStage'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    const list = [
      {
        label: i18n['customer.sales_opportunity.all_sales_stage'],
        value: 'all'
      }
    ];

    return Promise.resolve({
      ...res,
      data: list.concat(res.data)
    });
  });
});

export const getDetail = createAction(GET_DETAIL, (oppId, enable = true) =>
  get({
    url: `/v1/custom/opp/opportunity/${oppId}/detail`,
    data: { enable }
  })
);

export const remove = createAction(REMOVE, idList =>
  post({
    url: '/v1/custom/opp/opportunity/remove',
    data: idList
  })
);

export const createOpportunity = createAction(CREATE_OPPORTUNITY, data =>
  post({
    url: '/v1/custom/opp/opportunity/add',
    data: {
      ...data
    }
  })
);

export const updateOpportunity = createAction(
  UPDATE_OPPORTUNITY,
  (info, hasContract) => dispatch => {
    if (hasContract && info.salesStage != 5) {
      dispatch(
        showTipsModal({
          content: i18n['customer.sales_opportunity.detail.win_reject'],
          noCancel: true
        })
      );
      return Promise.resolve({
        result: false
      });
    }
    return post({
      url: '/v1/custom/opp/opportunity/update',
      data: {
        ...info
      }
    }).then(res => {
      dispatch({
        type: UPDATE_OPPORTUNITY,
        payload: res
      });
      return Promise.resolve(res);
    });
  }
);

export const getOpportunityTypeList = createAction(
  GET_OPPORTUNITY_TYPE_LIST,
  () =>
    get({
      url: '/v1/tenants/metadata/field/option/opportunityType'
    })
);

export const getLoseCauseList = createAction(GET_LOSE_CAUSE_LIST, () =>
  get({
    url: '/v1/tenants/metadata/field/option/loseCause'
  })
);

export const getFollowWayList = createAction(GET_FOLLOW_WAY_LIST, () =>
  get({
    url: '/v1/tenants/metadata/field/option/followWay'
  })
);

export const updateSalesStage = createAction(
  UPDATE_SALES_STAGE,
  ({ loseCause, opportunityId, salesStage }) =>
    post({
      url: '/v1/custom/opp/opportunity/updateSalesStage',
      data: {
        loseCause,
        opportunityId,
        salesStage
      }
    })
);

export const updateFollowRecord = createAction(
  UPDATE_FOLLOW_RECORD,
  (oppId, info) =>
    post({
      url: `/v1/custom/opp/record/upsert/${oppId}`,
      data: {
        ...info
      }
    })
);

export const getSearchTypeList = createAction(
  GET_SEARCH_TYPE_LIST,
  () => SALES_OPPORTUNITY_SEARCH_TYPE
);

export const updateCurrentSalesStage = createAction(
  UPDATE_CURRENT_SALES_STAGE,
  stage => stage
);

export const updateCurrentFilterType = createAction(
  UPDATE_CURRENT_FILTER_TYPE,
  type => type
);

export const updateCurrentSearchType = createAction(
  UPDATE_CURRENT_SEARCH_TYPE,
  type => type
);

export const updateCurrentPagination = createAction(
  UPDATE_CURRENT_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

export const updateSelecteds = createAction(
  UPDATE_SELECTEDS,
  selecteds => selecteds
);

export const getCustomerParticipant = createAction(
  GET_CUSTOMER_PARTICIPANT,
  customerId =>
    get({
      url: `/v1/custom/${customerId}/participant`
    })
);

export const getIsLostCustomer = createAction(
  GET_IS_LOST_CUSTOMER,
  customerId =>
    get({
      url: `/v2/custom/profiles/getIsLost/${customerId}`
    })
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);
