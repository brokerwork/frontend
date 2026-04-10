import { handleActions } from 'redux-actions';
import moment from 'moment';

import {
  GET_COLLECTIONS_DASHBOARDS,
  GET_TREND_DATAS,
  GET_HISTORY_DATA,
  MODIFY_PARAMS,
  INITIAL_PARAMS,
  RESET_DATA,
  GET_RANKINGS_DATA,
  GET_CUSTOMER_SOURCES,
  SET_MY_DASHBOARD_DATA,
  GET_TREND_DETAIL_DATA,
  MODIFY_PAGINATION,
  GET_SUM_DATA,
  GET_CUSTOMER_RANK,
  SET_DASHBOARD_VIEW_RIGHT,
  GET_ACCOUNT_RANK,
  GET_TRADE_VARIETY_DISTRIBUTE,
  GET_TRANSFER_FUNNEL,
  GET_DEPOSIT_DISTRIBUTE,
  GET_CUSTOMERS,
  GET_LATEST_TOTAL_DATA,
  GET_MY_DASHBOARD,
  SAVE_MY_DASHBOARD,
  DELETE_MY_DASHBOARD
} from './actions.js';

export const dashboardViewRight = handleActions(
  {
    [SET_DASHBOARD_VIEW_RIGHT]: (state, { payload }) => payload
  },
  {}
);

export const paginationInfo = handleActions(
  {
    [MODIFY_PAGINATION]: (state, { payload }) => ({ ...state, ...payload }),
    [RESET_DATA]: () => ({
      pageSize: 50,
      total: 0,
      pageNo: 1
    })
  },
  {
    pageSize: 50,
    total: 0,
    pageNo: 1
  }
);

// 客户排行
export const customerRankings = handleActions(
  {
    [GET_CUSTOMER_RANK]: (state, { payload }) => payload
  },
  {}
);

// 账户排行
export const accountRankings = handleActions(
  {
    [GET_ACCOUNT_RANK]: (state, { payload }) => payload
  },
  {}
);

export const sumData = handleActions(
  {
    [GET_SUM_DATA]: (state, { payload }) => payload
  },
  {}
);

export const collectionsDashboards = handleActions(
  {
    [GET_COLLECTIONS_DASHBOARDS]: (state, { payload }) => payload
  },
  []
);

export const trendData = handleActions(
  {
    [GET_TREND_DATAS]: (state, { payload }) => payload,
    [RESET_DATA]: state => ({})
  },
  {}
);

export const trendDetailData = handleActions(
  {
    [GET_TREND_DETAIL_DATA]: (state, { payload }) => payload
  },
  {}
);

export const transferFunnel = handleActions(
  {
    [GET_TRANSFER_FUNNEL]: (state, { payload }) => payload
  },
  {}
);

export const myDashboardData = handleActions(
  {
    [SET_MY_DASHBOARD_DATA]: (state, { payload }) => {
      return {
        ...state,
        [payload.type]: payload.data
      };
    }
  },
  {}
);

export const customerSourceOptions = handleActions(
  {
    [GET_CUSTOMER_SOURCES]: (state, { payload }) => payload
  },
  []
);

export const historyData = handleActions(
  {
    [GET_HISTORY_DATA]: (state, { payload }) => payload,
    [RESET_DATA]: state => ({})
  },
  {}
);

export const rankingsData = handleActions(
  {
    [GET_RANKINGS_DATA]: (state, { payload }) => payload,
    [RESET_DATA]: state => ({})
  },
  {
    labels: [],
    data: []
  }
);

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload,
    [RESET_DATA]: () => ({
      timeRange: 'DAY',
      fromTime: moment()
        .subtract(6, 'days')
        .startOf('day'),
      toTime: moment().endOf('day'),
      type: ''
    }),
    [INITIAL_PARAMS]: (state, { payload }) => ({
      timeRange: 'DAY',
      fromTime: moment()
        .subtract(6, 'days')
        .startOf('day'),
      toTime: moment().endOf('day'),
      type: payload
    })
  },
  {
    timeRange: 'DAY',
    fromTime: moment()
      .subtract(6, 'days')
      .startOf('day'),
    toTime: moment().endOf('day'),
    type: ''
  }
);

export const tradeVarietyDistributeData = handleActions(
  {
    [GET_TRADE_VARIETY_DISTRIBUTE]: (state, { payload }) => payload,
    [RESET_DATA]: state => []
  },
  []
);

export const depositDistributeData = handleActions(
  {
    [GET_DEPOSIT_DISTRIBUTE]: (state, { payload }) => payload
  },
  []
);

export const customers = handleActions(
  {
    [GET_DEPOSIT_DISTRIBUTE]: (state, { payload }) => payload
  },
  []
);

export const latestTotalData = handleActions(
  {
    [GET_LATEST_TOTAL_DATA]: (state, { payload }) => payload
  },
  {}
);

export const myDashboardArr = handleActions(
  {
    [GET_MY_DASHBOARD]: (state, { payload }) => payload,
    [SAVE_MY_DASHBOARD]: (state, { payload }) => payload,
    [DELETE_MY_DASHBOARD]: (state, { payload }) => payload
  },
  []
);
