import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';
import _ from 'lodash';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';
import { ADVANCED_SEARCH_CONFIG } from '../constant';
import { getUserInfo } from 'utils/userInfo';
// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'REPORT_CUSTOM_REPORT_DETAIL_';
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const POST_DOWNLOAD_REQUEST = `${PRE_FIX}POST_DOWNLOAD_REQUEST`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const GET_SERVER_SYMBOLS = `${PRE_FIX}GET_SERVER_SYMBOLS`;
export const REMOVE_CUSTOM_REPORT = `${PRE_FIX}REMOVE_CUSTOM_REPORT`;
export const GET_RESOURCES = `${PRE_FIX}GET_RESOURCES`;
export const GET_REPORT_CONFIG = `${PRE_FIX}GET_REPORT_CONFIG`;
export const GET_DETAIL_LIST = `${PRE_FIX}GET_DETAIL_LIST`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const INITIAL_PARAMS = `${PRE_FIX}INITIAL_PARAMS`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const GET_USER_LEVEL = `${PRE_FIX}GET_USER_LEVEL`;

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
  dispatch(getReportList(params));
});

export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

export const updateCurrentServer = createAction(
  UPDATE_CURRENT_SERVER,
  server => server
);

//提交下载请求
export const postDownloadRequest = createAction(POST_DOWNLOAD_REQUEST, data =>
  post({
    url: '/v2/report/sta/download/create',
    data: data
  })
);

//获取品种列表
export const getServerSymbols = createAction(
  GET_SERVER_SYMBOLS,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/manager/meta/symbols?searchType=SYMBOL',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

export const removeCustomReport = createAction(REMOVE_CUSTOM_REPORT, reportId =>
  post({
    url: `/v1/custom/report/config/delete/${reportId}`
  })
);

export const getResources = createAction(
  GET_RESOURCES,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/dropdown/resource',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          ...res.data,
          vendor
        }
      };
    })
);
// 获取报表配置
export const getReportConfig = createAction(GET_REPORT_CONFIG, reportId =>
  get({
    url: `/v1/custom/report/config/simple/${reportId}`
  })
);
// 互用层级
export const getUserLevel = createAction(GET_USER_LEVEL, () =>
  get({
    url: '/v1/level/list/earningReport/byAuthority'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const __arr = [{ label: i18n['usermgmt.level.all_level'], value: 'all' }];
    res.data.forEach(item => {
      __arr.push({
        value: item.id,
        label: item.name
      });
    });
    return Promise.resolve({
      ...res,
      data: __arr
    });
  })
);
// 获取报表配置之后初始化请求参数
export const initialParams = createAction(INITIAL_PARAMS, data => data);
// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);
// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);
// 更新当前排序字段和升降序类型
export const updateCurrentSortParam = createAction(
  UPDATE_CURRENT_SORT_PARAM,
  param => param
);
// 获取报表数据-高级搜索的很多字段都被改了，因为物业有需求，不要问我为什么要这样搞
export const getReportList = createAction(GET_DETAIL_LIST, data => dispatch => {
  const { conditions = [], reportType } = data;
  const objectType = _.find(conditions, { key: 'objectType' });
  const conditionsFiltered = objectType
    ? _.filter(conditions, cond => cond.key !== 'objectType')
    : conditions;
  const objectTypeValue = _.get(objectType, 'value', '');
  const userInfo = getUserInfo();
  const selfUserId = userInfo.id;
  const [ownerType = '', userId = selfUserId] = _.split(
    objectTypeValue,
    ADVANCED_SEARCH_CONFIG.arraySplit
  );
  const pager = data.pageNo || 1;
  delete data.pageNo;
  if (reportType === 'USER') delete data.serverId;
  post({
    url: '/v1/custom/report/list',
    data: {
      ...data,
      pager,
      conditions: conditionsFiltered.map(cond => {
        let end = {};

        if (_.get(cond, 'value.startDate', false)) {
          end = {
            field: cond.key,
            condition: cond.condition || cond.type,
            value: [
              moment(cond.value.startDate).format('YYYY-MM-DD'),
              moment(cond.value.endDate).format('YYYY-MM-DD')
            ]
          };
        } else if (
          ['group', 'accountGroup', 'symbol', 'leverage'].includes(cond.key)
        ) {
          const valArr = cond.value.split(ADVANCED_SEARCH_CONFIG.arraySplit);
          end = {
            field: cond.key,
            value:
              cond.key === 'leverage' ? valArr.map(val => val * 1) : valArr,
            condition: cond.type
          };
        } else if (
          // 需要传数字类型的字段
          [
            'login',
            'balance',
            'equity',
            'credit',
            'deposit',
            'withdraw',
            'netDeposit',
            'closeVolume',
            'openPrice',
            'commission',
            'swap',
            'profit',
            'ticket',
            'sl',
            'tp'
          ].includes(cond.key)
        ) {
          const num = cond.value * 1;
          end = {
            field: cond.key,
            value: isNaN(num) ? cond.value : num,
            condition: cond.type
          };
        } else {
          end = {
            field: cond.key,
            value: cond.value,
            condition: cond.type
          };
        }
        if (cond.originValue) {
          end.originValue = cond.originValue;
        }
        if (
          cond.key === 'openTime' &&
          (reportType === 'USER' ||
            reportType === 'ACCOUNT' ||
            reportType === 'FUND_CHANGE')
        ) {
          end.field = 'time';
        }
        if (cond.key === 'levelName') {
          end.field = 'levelId'
        }
        return end;
      }),
      ownerType,
      userId
    }
  }).then(res => {
    if (res.result && res.data && res.data.list) {
      dispatch(updateUpdateTime(res.time));
    }
    dispatch({
      type: GET_DETAIL_LIST,
      payload: Promise.resolve(res)
    });
  });
});

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

export const getEarningSubLevelUsers = createAction(
  GET_USER_SUB_LEVEL_USERS,
  v =>
    get({
      url: '/v1/user/tree/child',
      data: {
        userId: v ? v : '',
        module: 'EarningReport'
      }
    })
);
