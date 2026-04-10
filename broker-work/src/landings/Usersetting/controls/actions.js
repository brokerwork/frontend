import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'USER_SETTING_';
export const GET_ROLE_LIST = `${PRE_FIX}GET_ROLE_LIST`;
export const GET_USER_LIST = `${PRE_FIX}GET_USER_LIST`;
export const UPDATE_EMAIL_SETTING = `${PRE_FIX}UPDATE_EMAIL_SETTING`;
export const UPDATE_PASSWORD = `${PRE_FIX}UPDATE_PASSWORD`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_USER_AGENT_FORM_COLUMNS = `${PRE_FIX}GET_USER_AGENT_FORM_COLUMNS`;
export const GET_PASSWORD_STRENGTH = `${PRE_FIX}GET_PASSWORD_STRENGTH`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getRoleList = createAction(GET_ROLE_LIST, () =>
  post({
    url: '/v1/roleRight/role/list'
  })
);

export const getUserList = createAction(GET_USER_LIST, () =>
  post({
    url: '/v1/user/listSimpleUser'
  })
);

export const updateEmail = createAction(UPDATE_EMAIL_SETTING, email =>
  post({
    url: `/v1/user/bind/${email}/mail`
  })
);

export const updatePassword = createAction(UPDATE_PASSWORD, pwd =>
  post({
    url: '/v1/user/pwd/modify',
    data: pwd
  })
);

// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

// 获取代理任务自定义字段
export const getUserAgentFormColumns = createAction(
  GET_USER_AGENT_FORM_COLUMNS,
  () =>
    get({
      url: '/v1/tenants/metadata/form-field/list',
      data: {
        tableName: 't_user_agent'
      }
    })
);
// 获取密码强度
export const getPasswordStrength = createAction(GET_PASSWORD_STRENGTH, () =>
  get({
    url: '/v1/user/login/access'
  })
);
