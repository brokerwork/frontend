import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';
import i18n from 'utils/i18n';
import { dateFormatStyle } from 'utils/config';
import moment from 'moment';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'DASHBOARD_MY_DASHBOARD_';
export const GET_COLLECTIONS_DASHBOARDS = `${PRE_FIX}GET_COLLECTIONS_DASHBOARDS`;
export const GET_TREND_DATAS = `${PRE_FIX}GET_TREND_DATAS`;
export const GET_RANKINGS_DATA = `${PRE_FIX}GET_RANKINGS_DATA`;
export const GET_CUSTOMER_SOURCES = `${PRE_FIX}GET_CUSTOMER_SOURCES`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const INITIAL_PARAMS = `${PRE_FIX}INITIAL_PARAMS`;
export const RESET_DATA = `${PRE_FIX}RESET_DATA`;
export const GET_HISTORY_DATA = `${PRE_FIX}GET_HISTORY_DATA`;
export const SET_MY_DASHBOARD_DATA = `${PRE_FIX}SET_MY_DASHBOARD_DATA`;
export const GET_TREND_DETAIL_DATA = `${PRE_FIX}GET_TREND_DETAIL_DATA`;
export const MODIFY_PAGINATION = `${PRE_FIX}MODIFY_PAGINATION`;
export const GET_SUM_DATA = `${PRE_FIX}GET_SUM_DATA`;
export const GET_CUSTOMER_RANK = `${PRE_FIX}GET_CUSTOMER_RANK`;
export const SET_DASHBOARD_VIEW_RIGHT = `${PRE_FIX}SET_DASHBOARD_VIEW_RIGHT`;
export const GET_ACCOUNT_RANK = `${PRE_FIX}GET_ACCOUNT_RANK`;
export const GET_TRADE_VARIETY_DISTRIBUTE = `${PRE_FIX}GET_TRADE_VARIETY_DISTRIBUTE`;
export const GET_TRANSFER_FUNNEL = `${PRE_FIX}GET_TRANSFER_FUNNEL`;
export const GET_DEPOSIT_DISTRIBUTE = `${PRE_FIX}GET_DEPOSIT_DISTRIBUTE`;
export const GET_CUSTOMERS = `${PRE_FIX}GET_CUSTOMERS`;
export const GET_LATEST_TOTAL_DATA = `${PRE_FIX}GET_LATEST_TOTAL_DATA`;
export const GET_MY_DASHBOARD = `${PRE_FIX}GET_MY_DASHBOARD`;
export const SAVE_MY_DASHBOARD = `${PRE_FIX}SAVE_MY_DASHBOARD`;
export const DELETE_MY_DASHBOARD = `${PRE_FIX}DELETE_MY_DASHBOARD`;
export const GET_MY_DASHBOARD_ITEM = `${PRE_FIX}GET_MY_DASHBOARD_ITEM`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 相关仪表盘权限
export const setDashboardViewRight = createAction(
  SET_DASHBOARD_VIEW_RIGHT,
  userRights => {
    const rights = {};
    // 佣金统计
    //【按天返佣报表or实时返佣报表】【返佣对象查看范围】
    rights['commission'] =
      (userRights['STAT_VIEW_COMMISSION_REPORTTYPE_AUTO'] ||
        userRights['STAT_VIEW_COMMISSION_REPORTTYPE_AUTO']) &&
      userRights['STAT_VIEW_COMMISSION_RANGE'];
    // 查看客户权限
    rights['checkCustomer'] = userRights['CUSTOMER_SELECT'];
    // 查看账户权限
    rights['checkAccount'] = userRights['ACCOUNT_SELECT'];
    // 账户交易记录权限
    rights['accountTrade'] =
      userRights['ACCOUNT_SELECT_DIRECTLY_TRADE'] ||
      userRights['ACCOUNT_SELECT_SUBORDINATE_TRADE'] ||
      userRights['ACCOUNT_SELECT_WILD_TRADE'] ||
      userRights['ACCOUNT_SELECT_ALL_TRADE'];

    return Promise.resolve({
      data: rights,
      result: true
    });
  },
  () => ({ noMask: true })
);

export const modifyTablePagination = createAction(
  MODIFY_PAGINATION,
  data => data
);

export const dashboarDataHandle = (type, d) => {
  const { label, data } = d;
  const labels = [];
  const handleData = [];
  const keys = Object.keys(data);
  label.forEach((item, index) => {
    const obj = {};
    keys.forEach(key => {
      obj[key] = data[key][index];
    });
    const l = ['NO_MOMENT'].includes(type)
      ? item
      : moment(Number(item) * 1000).format(dateFormatStyle);
    labels.push(l);
    handleData.push(obj);
  });
  return { labels, data: handleData };
};

export const getTrendDatas = createAction(
  GET_TREND_DATAS,
  (params, doNotResetPagination) => dispatch => {
    const meta = params._meta;
    delete params._meta;
    return dispatch({
      type: GET_TREND_DATAS,
      meta,
      payload: post({
        url: '/v1/statistic/query/trend',
        data: {
          ...params,
          fromTime: moment(params.fromTime).format(),
          toTime: moment(params.toTime).format()
        }
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        const data = dashboarDataHandle(null, res.data);
        if (!doNotResetPagination) {
          const t = data.data || [];
          const total = t.length;
          dispatch(modifyTablePagination({ total, pageNo: 1 }));
        }
        return Promise.resolve({ ...res, data });
      })
    });
  }
);

export const getTrendDetailData = createAction(GET_TREND_DETAIL_DATA, type =>
  post({
    url: '/v1/statistic/query/latest/detail',
    data: { type }
  })
);

// 来源转化漏斗
export const getTransferFunnel = createAction(GET_TRANSFER_FUNNEL, params =>
  post({
    url: '/v1/statistic/query/customer/funnel',
    data: {
      ...params,
      toTime: params.toTime.format(),
      fromTime: params.fromTime.format()
    }
  })
);

// 客户列表
export const getSumData = createAction(GET_SUM_DATA, params =>
  post({
    url: '/v1/statistic/query/range/sum',
    data: {
      ...params,
      toTime: params.toTime.format(),
      fromTime: params.fromTime.format()
    }
  })
);

// 获取客户排名数据
export const getCustomerRankings = createAction(GET_CUSTOMER_RANK, params =>
  post({
    url: '/v1/statistic/query/customerRank',
    data: {
      ...params,
      toTime: params.toTime.format(),
      fromTime: params.fromTime.format()
    }
  })
);

// 获取账户排名数据
export const getAccountRankings = createAction(GET_ACCOUNT_RANK, params => {
  console.log('params', params.toTime, params.toTime.format());
  return post({
    url: '/v1/statistic/query/accountRank',
    data: {
      ...params,
      toTime: params.toTime.format(),
      fromTime: params.fromTime.format()
    }
  });
});

// 获取排名数据
const rankingsDataHandle = (label, data) => {
  const keys = Object.keys(data);
  const end = [];
  label.forEach((l, index) => {
    const obj = {};
    keys.forEach(key => {
      obj[key] = data[key][index];
    });
    if (l === 'all') {
      end.unshift(obj);
    } else {
      end.push(obj);
    }
  });
  return {
    labels: label.includes('all')
      ? ['all', ...label.filter(l => l !== 'all')]
      : label,
    data: end
  };
};

export const getRankingsData = createAction(
  GET_RANKINGS_DATA,
  (params, doNotResetPagination) => dispatch => {
    const meta = params._meta;
    delete params._meta;
    return dispatch({
      type: GET_RANKINGS_DATA,
      meta,
      payload: post({
        url: '/v1/statistic/query/rank',
        data: {
          ...params,
          fromTime: params.fromTime.format(),
          toTime: params.toTime.format()
        }
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        const { label, data } = res.data;
        const end = rankingsDataHandle(label, data);
        if (!doNotResetPagination) {
          const t = end.data || [];
          const total = t.length;
          dispatch(modifyTablePagination({ total, pageNo: 1 }));
        }
        return Promise.resolve({
          ...res,
          data: {
            labels: end.labels,
            data: end.data
          }
        });
      })
    });
  }
);

// 获取历史数据
export const getHistoryData = createAction(GET_HISTORY_DATA, params =>
  post({
    url: '/v1/statistic/query/trend/detail',
    data: {
      ...params,
      fromTime: params.fromTime.format(),
      toTime: params.toTime.format()
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const data = {};
    const keys = Object.keys(res.data);
    keys.forEach(key => {
      const d = res.data[key];
      data[key] = dashboarDataHandle(null, d);
    });
    return Promise.resolve({ ...res, data });
  })
);

// 获取客户来源列表
export const getCustomerSources = createAction(GET_CUSTOMER_SOURCES, params =>
  get({
    url: '/v2/custom/source/option'
  })
);

export const initialParams = createAction(INITIAL_PARAMS, type => type);

export const resetData = createAction(RESET_DATA);

export const modifyParams = createAction(MODIFY_PARAMS, data => data);

export const setMyDashboardData = createAction(
  SET_MY_DASHBOARD_DATA,
  (type, data) => ({ type, data })
);

const getDataMap = function(name) {
  switch (name) {
    case 'getRankingsData':
      return getRankingsData;
    case 'getDepositDistribute':
      return getDepositDistribute;
    case 'getTradeVarietyDistribute':
      return getTradeVarietyDistribute;
    case 'getAccountRankings':
      return getAccountRankings;
    case 'getCustomerRankings':
      return getCustomerRankings;
    case 'getTransferFunnel':
      return getTransferFunnel;
    default:
      getTrendDatas;
  }
};
export const getCollections = createAction(
  GET_COLLECTIONS_DASHBOARDS,
  () => dispatch => {
    const data = [
      'NEW_CUSTOMER_PANEL',
      'USER_RANK_PANEL',
      'TOTAL_CUSTOMER_PANEL',
      'TRADE_PANEL'
    ];

    data.forEach(item => {
      getDataMap[item](
        {
          type: item,
          filterType: 'all',
          timeRange: 'DAY',
          fromTime: moment()
            .subtract(6, 'days')
            .startOf('day'),
          toTime: moment().endOf('day')
        },
        true
      ).payload.then(res => {
        if (!res.result) return Promise.resolve(res);
        dispatch(setMyDashboardData(item, res.data));
      });
    });
    dispatch({
      type: GET_COLLECTIONS_DASHBOARDS,
      payload: Promise.resolve({
        result: true,
        data: data
      })
    });
  }
);
// 获取我的仪表盘单个图表的数据
export const getMyDashboardItem = createAction(
  GET_MY_DASHBOARD_ITEM,
  (searchParams, item) => dispatch => {
    const metaConst = { noMask: true };
    if (item.chart === 'transformTrend') {
      if (item.type === 'line') {
        const getHistoryDataAct = getHistoryData({
          ...searchParams,
          type: item.key[0]
        });
        getHistoryDataAct.meta = metaConst;
        Promise.all([
          dispatch(getHistoryDataAct),
          dispatch(getCustomerSources())
        ]).then(([historyData, customerSourceOptions]) => {
          if (!historyData.data) return;
          dispatch(
            setMyDashboardData(item.value, {
              activeFilter: Object.keys(historyData.data)[0],
              historyData: historyData.data,
              rankingsData: {
                labels: [],
                data: []
              },
              customerSourceOptions: customerSourceOptions.data
            })
          );
        });
        return;
      }
      if (item.type === 'pie') {
        let getRankingsDataAct = getRankingsData({
          ...searchParams,
          type: item.key[0],
          _meta: metaConst
        });
        Promise.all([
          dispatch(getRankingsDataAct),
          dispatch(getCustomerSources())
        ]).then(([rankingsData, customerSourceOptions]) => {
          dispatch(
            setMyDashboardData(item.value, {
              activeFilter: Object.keys(rankingsData.data)[0],
              rankingsData: rankingsData.data,
              historyData: {
                labels: [],
                data: []
              },
              customerSourceOptions: customerSourceOptions.data
            })
          );
        });
        return;
      }
    }
    if (!item.function) {
      if (item.key && Array.isArray(item.key)) {
        const promiseArr = item.key.map(k => {
          return dispatch(
            getTrendDatas({
              ...searchParams,
              type: k,
              _meta: metaConst
            })
          );
        });
        Promise.all(promiseArr).then(resArr => {
          let resData = {
            data: [],
            labels: []
          };
          resArr.forEach(res => {
            if (res.result) {
              const { data, labels } = res.data;
              data.map((d, index) => {
                resData.data[index] ? null : resData.data.push(d);
                Object.assign(resData.data[index], d);
              });
              if (!resData.labels.length) {
                resData.labels = labels;
              }
            }
          });
          dispatch(setMyDashboardData(item.value, resData));
        });
      } else {
        dispatch(
          getTrendDatas({
            ...searchParams,
            type: item.value,
            _meta: metaConst
          })
        ).then(res => {
          dispatch(setMyDashboardData(item.value, res.result ? res.data : {}));
        });
      }
      return;
    }
    const fn = getDataMap(item.function);
    if (
      item.function === 'getCustomerRankings' ||
      item.function === 'getAccountRankings'
    ) {
      const fnAction = fn({
        ...searchParams,
        type: [item.value]
      });
      fnAction.meta = metaConst;
      dispatch(fnAction).then(res => {
        dispatch(
          setMyDashboardData(
            item.value,
            res.result ? { data: res.data[item.value], type: item.value } : {}
          )
        );
      });
      return;
    }
    let fnAction = {};
    if (item.chart === 'transferFunnel') {
      fnAction = fn({
        ...searchParams,
        trasnferPeriod: 7
      });
    } else {
      fnAction = fn({
        ...searchParams,
        type: item.value
      });
    }
    fnAction.meta = metaConst;
    dispatch(fnAction).then(res => {
      if (item.chart === 'transferFunnel') {
        dispatch(
          setMyDashboardData(
            item.value,
            res.result ? { data: res.data, activeSource: 'all' } : {}
          )
        );
        return;
      }
      if (item.chart === 'tradeVarietyDistribute') {
        dispatch(
          setMyDashboardData(item.value, res.result ? { data: res.data } : {})
        );
        return;
      }
      dispatch(
        setMyDashboardData(item.value, res ? (res.result ? res.data : {}) : {})
      );
    });
    return;
  }
);

// 获取交易品种分布
export const getTradeVarietyDistribute = createAction(
  GET_TRADE_VARIETY_DISTRIBUTE,
  data =>
    post({
      url: '/v1/statistic/query/symbol/distribute',
      data: {
        fromTime: data.fromTime.format(),
        toTime: data.toTime.format()
      }
    })
);
const distributeMap = {
  0: '<1000',
  1: '1000~5000',
  2: '5000~10000',
  3: '10000~50000',
  4: '>50000 '
};

export const getDepositDistribute = createAction(
  GET_DEPOSIT_DISTRIBUTE,
  ({ fromTime, toTime }) =>
    post({
      url: '/v1/statistic/query/customer/deposit/distribute',
      data: {
        fromTime: fromTime.format(),
        toTime: toTime.format()
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          data: res.data.map(item => {
            return {
              value: item.value,
              name: distributeMap[item.key]
            };
          }),
          labels: res.data.map(item => distributeMap[item.key])
        }
      };
    }),
  () => ({
    noMask: true
  })
);

export const getCustomers = createAction(GET_CUSTOMERS, params =>
  post({
    url: '/v1/statistic/query/trend',
    data: params
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const data = dashboarDataHandle(params.type, res.data);
    return { ...res, data };
  })
);

export const getLatestTotalData = createAction(GET_LATEST_TOTAL_DATA, type =>
  post({
    url: '/v1/statistic/query/latest',
    data: { type }
  })
);

const myDashboardHandler = res => {
  if (res.result) {
    let end = [];
    if (res.data && res.data.type) {
      const type = res.data.type;
      end = type;
    }
    return {
      ...res,
      data: end
    };
  }
  return Promise.resolve(res);
};

export const getMyDashboard = createAction(GET_MY_DASHBOARD, () =>
  get({
    url: '/v1/dashboard/config/current'
  }).then(myDashboardHandler)
);

export const saveMyDashboard = createAction(SAVE_MY_DASHBOARD, myDashboardArr =>
  post({
    url: '/v1/dashboard/config/save',
    data: {
      type: myDashboardArr
    }
  }).then(myDashboardHandler)
);

export const deleteMyDashboard = createAction(DELETE_MY_DASHBOARD, data =>
  post({
    url: '/v1/dashboard/config/delete',
    data
  })
);
