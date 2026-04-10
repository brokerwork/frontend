import { createAction } from 'redux-actions';
import { get, post, dele, put } from 'utils/ajax';

// action types

const PRE_FIX = 'TRADE_SETTING_';

export const GET_BASIC_INFO = `${PRE_FIX}GET_BASIC_INFO`;
export const SAVE_BASIC_INFO = `${PRE_FIX}SAVE_BASIC_INFO`;
export const UPDATE_ACCOUNT = `${PRE_FIX}UPDATE_ACCOUNT`;
export const ADD_ACCOUNT = `${PRE_FIX}ADD_ACCOUNT`;
export const DEL_ACCOUNT = `${PRE_FIX}DEL_ACCOUNT`;
export const GET_ACCOUNT_LIST = `${PRE_FIX}GET_ACCOUNT_LIST`;
export const GET_BALANCE = `${PRE_FIX}GET_BALANCE`;
export const GET_SERVER_BY_VENDOR = `${PRE_FIX}GET_SERVER_BY_VENDOR`;

//action creaters

//获取当前页数据列表
export const getBasicInfo = createAction(GET_BASIC_INFO, () =>
  get({
    url: '/v1/agent/margin/setting'
  })
);

//保存基本信息
export const saveBasicInfo = createAction(SAVE_BASIC_INFO, data =>
  post({
    url: '/v1/agent/margin/setting',
    data: data
  })
);

//添加编辑下级结算用户
export const addAccount = createAction(ADD_ACCOUNT, data =>
  post({
    url: '/v1/agent/margin/user',
    data: data
  })
);
export const updateAccount = createAction(UPDATE_ACCOUNT, data =>
  put({
    url: '/v1/agent/margin/user',
    data: data
  })
);
//删除下级结算用户
export const delAccount = createAction(DEL_ACCOUNT, id =>
  dele({
    url: `/v1/agent/margin/user/${id}`
  })
);

//获取用户列表用于局部刷新
export const getAccountList = createAction(GET_ACCOUNT_LIST, () =>
  get({
    url: '/v1/user/listSimpleUserHaveAccount'
  })
);

//获取保证金余额
export const getBalance = createAction(GET_BALANCE, id =>
  get({
    url: `/v1/agent/margin/user/balance/${id}`
  })
);

export const getServerByVendor = createAction(GET_SERVER_BY_VENDOR, vendor =>
  get({
    url: `/v1/report/setting/serverGroups/${vendor}`
  })
);
