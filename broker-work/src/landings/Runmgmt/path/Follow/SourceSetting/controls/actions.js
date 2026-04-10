import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'SOURCE_SETTING_';
export const GET_LIST = `${PRE_FIX}GET_LIST`;
export const ADD_SOURCE = `${PRE_FIX}ADD_SOURCE`;
export const EDIT_SOURCE = `${PRE_FIX}EDIT_SOURCE`;
export const LOCK_SOURCE = `${PRE_FIX}LOCK_SOURCE`;
export const UNLOCK_SOURCE = `${PRE_FIX}UNLOCK_SOURCE`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const IS_EXPIRE = `${PRE_FIX}IS_EXPIRE`;

// ---------------------------------------------
// action types
// ---------------------------------------------
export const getList = createAction(GET_LIST, data =>
  get({
    url: '/v1/signal/config/list',
    data
  })
);

export const addSource = createAction(ADD_SOURCE, data =>
  post({
    url: `/v1/signal/config/add?serverId=${data.serverId}`,
    data
  })
);

export const editSource = createAction(EDIT_SOURCE, data =>
  post({
    url: `/v1/signal/config/edit?serverId=${data.serverId}&id=${data.tradeId}`,
    data
  }).then(res => ({
    ...res,
    data
  }))
);

export const lockSource = createAction(LOCK_SOURCE, (id, serverId) =>
  post({
    url: `/v1/signal/config/lock?id=${id}&serverId=${serverId}`
  }).then(res => ({
    ...res,
    data: {
      id
    }
  }))
);

export const unlockSource = createAction(UNLOCK_SOURCE, (id, serverId) =>
  post({
    url: `/v1/signal/config/unlock?id=${id}&serverId=${serverId}`
  }).then(res => ({
    ...res,
    data: {
      id
    }
  }))
);

export const modifySearchParams = createAction(
  MODIFY_PARAMS,
  params => dispatch => {
    dispatch({
      type: MODIFY_PARAMS,
      payload: params
    });
    dispatch(getList(params));
  }
);

export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({
    url: '/v1/signal/config/servers'
  })
);

export const isExpire = createAction(IS_EXPIRE, () =>
  get({
    url: '/v1/product/service/expired?type=service&serviceName=follow_order'
  })
);
