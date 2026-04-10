import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import moment from 'moment';
const DATE_FORMAT_STYLE = 'YYYYMMDD';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'TAUSERMGMT_';
export const GET_USERS = `${PRE_FIX}GET_USERS`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const UPDATE_SELECTED_USERS = `${PRE_FIX}UPDATE_SELECTED_USERS`;
export const DELETE_USERS = `${PRE_FIX}DELETE_USERS`;
export const UPDATE_LOGIN_STATUS = `${PRE_FIX}UPDATE_LOGIN_STATUS`;
export const GET_USER_INFO = `${PRE_FIX}GET_USER_INFO`;
export const UPDATE_USER_PASSWORD = `${PRE_FIX}UPDATE_USER_PASSWORD`;
export const GET_PRODUCT_INFO = `${PRE_FIX}GET_PRODUCT_INFO`;
export const UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS = `${PRE_FIX}UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const UPDATE_DEPOSIT_STATUS = `${PRE_FIX}UPDATE_DEPOSIT_STATUS`;
export const FA_RESET = `${PRE_FIX}FA_RESET`;
export const GET_ACCESS_CONF = `${PRE_FIX}GET_ACCESS_CONF`;
export const GET_LEVEL_RELATIONS_LIST = `${PRE_FIX}GET_LEVEL_RELATIONS_LIST`;
export const ADD_TA_USER = `${PRE_FIX}ADD_TA_USER`;
export const CHECK_TA_USER = `${PRE_FIX}CHECK_TA_USER`;
export const GET_PASSWORD_STRENGTH = `${PRE_FIX}GET_PASSWORD_STRENGTH`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const SIM_ACCOUNT_CHECK_BIND = `${PRE_FIX}SIM_ACCOUNT_CHECK_BIND`;
export const SIM_ACCOUNT_BIND = `${PRE_FIX}SIM_ACCOUNT_BIND`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取用户列表
export const getUsers = createAction(
  GET_USERS,
  ({
    startDate,
    endDate,
    page,
    size,
    value,
    sort,
    order,
    userName,
    phone
  }) => dispatch => {
    const from = moment(startDate).format(DATE_FORMAT_STYLE);
    const to = moment(endDate).format(DATE_FORMAT_STYLE);
    dispatch({
      type: GET_USERS,
      payload: get({
        url: encodeURI(
          `/v2/ta/user/mng/list?from=${from}&to=${to}&page=${page}&size=${size}&value=${value}&sort=${sort}&order=${order}&userName=${userName}&phone=${phone}`
        )
      }).then(res => {
        if (res.result && res.data && res.data.list) {
          dispatch(updateUpdateTime(res.time));
        }
        return Promise.resolve(res);
      })
    });
  }
);

//更新列表请求参数
export const modifyParams = createAction(MODIFY_PARAMS, params => params);

//更新选择
export const updateSelectedUsers = createAction(
  UPDATE_SELECTED_USERS,
  map => map
);

//删除用户
export const deleteUsers = createAction(DELETE_USERS, users =>
  post({
    url: '/v1/ta/user/mng/delete',
    data: users
  })
);

//更改用户login状态
export const updateLoginStatus = createAction(
  UPDATE_LOGIN_STATUS,
  (id, toggle) => {
    const isEnable = toggle ? 'enable' : 'disable';
    return post({
      url: `/v1/ta/user/mng/${isEnable}?taUserId=${id}`
    });
  }
);

// 更改用户是否允许在线入金
export const updateDepositStatus = createAction(
  UPDATE_DEPOSIT_STATUS,
  (id, toggle) => {
    const isEnable = toggle ? 'enableDeposit' : 'disableDeposit';
    return post({
      url: `/v1/ta/user/mng/${isEnable}?taUserId=${id}`
    });
  }
);

//获取用户详情
export const getUserInfo = createAction(GET_USER_INFO, id =>
  get({
    url: `/v1/ta/user/mng/detail?taUserId=${id}`
  })
);

// 清除用户信息
export const resetUserInfo = createAction(GET_USER_INFO, () => ({}));

//重置用户密码
export const updateUserPassword = createAction(
  UPDATE_USER_PASSWORD,
  (id, newPwd) => {
    return post({
      url: `/v1/ta/user/mng/${id}/set`,
      data: {
        newPwd: newPwd
      }
    });
  }
);

export const updateAdvancedLogicType = createAction(
  UPDATE_ADVANCED_LOGIC_TYPE,
  type => type
);

export const updateSelectedAdvancedSearchConditions = createAction(
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  conditions => conditions
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);
// 更新列表更新时间
export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);
export const faReset = createAction(FA_RESET, ({ taUserId, type }) =>
  post({
    url: `/v1/ta/user/mng/2fa/reset?taUserId=${taUserId}&type=${type}`
  })
);
// get sc 访问设置
export const getAccessConf = createAction(GET_ACCESS_CONF, () =>
  get({
    url: `/v1/product/access/conf?productId=TW`
  })
);
// 获取层级关系列表
export const getLevelRelationList = createAction(
  GET_LEVEL_RELATIONS_LIST,
  (account, serverId, vendor) =>
    get({
      url: `/v1/account/manage/user/${account}/tree?serverId=${serverId}&vendor=${vendor}`
    })
);
// tw新建用户
export const addTaUser = createAction(ADD_TA_USER, data =>
  post({
    url: `/v1/ta/user/mng/forBw/add`,
    data
  })
);

export const checkTaUser = createAction(CHECK_TA_USER, data =>
  post({
    url: `/v1/ta/user/mng/forBw/check`,
    data
  })
);
// 获取密码强度
export const getPasswordStrength = createAction(GET_PASSWORD_STRENGTH, () =>
  get({
    url: '/v1/user/login/access?productId=TW'
  })
);

//获取mt服务器信息
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/demoServerList' })
);

export const simAccountCheckBind = createAction(SIM_ACCOUNT_CHECK_BIND, data =>
  post({ url: '/v1/account/demo/checkBind', data })
);
export const simAccountBind = createAction(SIM_ACCOUNT_BIND, data =>
  post({ url: '/v1/account/demo/bind', data })
);
