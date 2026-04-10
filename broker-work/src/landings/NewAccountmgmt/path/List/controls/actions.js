import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'ACCOUNT_';
export const UPDATE_CURRENT_PRIVILEGE_TYPE = `${PRE_FIX}UPDATE_CURRENT_PRIVILEGE_TYPE`;
export const GET_ACCOUNT_LIST = `${PRE_FIX}GET_ACCOUNT_LIST`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const UPDATE_ORDER_BY = `${PRE_FIX}UPDATE_ORDER_BY`;
export const UPDATE_DATE_RANGE = `${PRE_FIX}UPDATE_DATE_RANGE`;
export const UPDATE_SELECTED_ACCOUNT_IDS = `${PRE_FIX}UPDATE_SELECTED_ACCOUNT_IDS`;
export const UPDATE_OWNERSHIP = `${PRE_FIX}UPDATE_OWNERSHIP`;
export const UPDATE_LEVERAGE = `${PRE_FIX}UPDATE_LEVERAGE`;
export const UPDATE_GROUP = `${PRE_FIX}UPDATE_GROUP`;
export const CHECK_ACCOUNT_CUSTOMER_AND_TA = `${PRE_FIX}CHECK_ACCOUNT_CUSTOMER_AND_TA`;
export const REMOVE_ACCOUNT = `${PRE_FIX}REMOVE_ACCOUNT`;
export const UPDATE_BALANCE = `${PRE_FIX}UPDATE_BALANCE`;
export const CREATE_ACCOUNT = `${PRE_FIX}CREATE_ACCOUNT`;
export const GET_TA_USER_BY_CUSTOMER_ID = `${PRE_FIX}GET_TA_USER_BY_CUSTOMER_ID`;
export const GET_OWNER_INFO = `${PRE_FIX}GET_OWNER_INFO`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const UPDATE_SEARCH_LOGIC_TYPE = `${PRE_FIX}UPDATE_SEARCH_LOGIC_TYPE`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const UPDATE_FILTER_USER = `${PRE_FIX}UPDATE_FILTER_USER`;
export const GET_EXPORT_INFO = `${PRE_FIX}GET_EXPORT_INFO`;
export const RUN_DEPOSIT_EXCEL = `${PRE_FIX}RUN_DEPOSIT_EXCEL`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const UPDATE_FUZZY_VAL = `${PRE_FIX}UPDATE_FUZZY_VAL`;
export const UPDATE_CELL_STATUS = `${PRE_FIX}UPDATE_CELL_STATUS`;
export const SEND_MSG_CHECK = `${PRE_FIX}SEND_MSG_CHECK`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 更新当前账户归属类型
export const updateCurrentPrivilegeType = createAction(
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  type => type
);

// 获取账户列表
export const getAccountList = createAction(
  GET_ACCOUNT_LIST,
  (
    {
      fieldConditions = [],
      startDate = null,
      endDate = null,
      pageNo = 1,
      pageSize = 10,
      userId,
      logicType,
      sortby = 'regdate',
      orderDesc = true,
      searchId,
      fuzzyValue
    },
    { serverId, vendor }
  ) =>
    post({
      url: '/v3/account/list',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        fieldConditions,
        startDate,
        endDate,
        pageNo,
        pageSize,
        userId,
        logicType,
        sortby,
        orderDesc,
        searchId,
        fuzzyValue
      }
    })
);

export const updatePagination = createAction(
  UPDATE_PAGINATION,
  pagination => pagination
);

export const updateOrderBy = createAction(UPDATE_ORDER_BY, data => data);

export const updateDateRange = createAction(
  UPDATE_DATE_RANGE,
  dateRange => dateRange
);

export const updateSelectedAccountIds = createAction(
  UPDATE_SELECTED_ACCOUNT_IDS,
  ids => ids
);

export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);

export const updateSearchLogicType = createAction(
  UPDATE_SEARCH_LOGIC_TYPE,
  type => type
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const updateFilterUser = createAction(UPDATE_FILTER_USER, user => user);

// 设置账户归属
export const updateOwnership = createAction(
  UPDATE_OWNERSHIP,
  ({ accounts, userId, userName }, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/setOwnership',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        accounts,
        userId,
        userName
      }
    })
);

// 更新杠杆
export const updateLeverage = createAction(
  UPDATE_LEVERAGE,
  (data, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/updateLeverage',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data
    })
);

// 更新组
export const updateGroup = createAction(
  UPDATE_GROUP,
  (data, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/updateMtGroupAndUserGroup',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data
    })
);

// 检查账户是否绑定了客户和TA用户
export const checkAccountCusAndTA = createAction(
  CHECK_ACCOUNT_CUSTOMER_AND_TA,
  (accounts, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/customer/checkAccountCusAndTA',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        accounts
      }
    })
);

// 删除账户
export const removeAccount = createAction(
  REMOVE_ACCOUNT,
  (accounts, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/delete',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        accounts
      }
    })
);

// 更新出入金、信用
export const updateBalance = createAction(
  UPDATE_BALANCE,
  (data, { vendor, serverId }) =>
    post({
      url: '/v2/account/balance',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data
    })
);

// 创建账户
export const createAccount = createAction(
  CREATE_ACCOUNT,
  (data, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/openForBw',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data
    })
);

// 根据customerId获取TaUser信息
export const getTaUserByCustomerId = createAction(
  GET_TA_USER_BY_CUSTOMER_ID,
  (customerId, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/customer/findTaInfoByCustomerId',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        customerIds: [customerId]
      }
    })
);

// 根据id获取账户所有人资料
export const getOwnerInfo = createAction(
  GET_OWNER_INFO,
  (id, idType, { vendor, serverId }) =>
    get({
      url: `/v2/account/owner/info/${id}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        idType
      }
    })
);

// 获取用户下级
export const getUserSubLevelUsers = createAction(
  GET_USER_SUB_LEVEL_USERS,
  (userId = '') =>
    get({
      url: '/v1/user/tree/child',
      data: {
        userId,
        module: 'Account'
      }
    })
);

export const getExportInfo = createAction(
  GET_EXPORT_INFO,
  (id, { vendor, serverId }) =>
    get({
      url: `/v2/account/export/${id}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

export const runDepositExcel = createAction(
  RUN_DEPOSIT_EXCEL,
  (id, sendEmail) =>
    post({
      url: `/v2/account/import/excel/deposit/${id}/handle?sendEmail=${sendEmail}`
    })
);

export const updateFuzzyVal = createAction(UPDATE_FUZZY_VAL, val => val);

export const updateCellStatus = createAction(
  UPDATE_CELL_STATUS,
  (key, accountId, status, vendor, serverId) =>
    post({
      url: `/v2/account/${key}/switch?accountId=${accountId}&${key}=${status}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

export const sendMsgCheck = createAction(
  SEND_MSG_CHECK,
  (accountIds, type, { vendor, serverId }) =>
    post({
      url: `/v1/account/manage/sendMsgCheck?accountIds=${accountIds.reduce(
        (a, b) => `${a},${b}`
      )}&type=${type}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);
