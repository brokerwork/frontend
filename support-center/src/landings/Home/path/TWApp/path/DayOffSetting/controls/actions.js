import { createAction } from 'redux-actions';
import { get, post, put } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'DAY_OFF_SETTING_';
export const GET_SERVER = `${PRE_FIX}GET_SERVER`;
export const SERVER_CHANGE = `${PRE_FIX}SERVER_CHANGE`;
export const GET_SERVER_DAY_OFF_LIST = `${PRE_FIX}GET_SERVER_DAY_OFF_LIST`;
export const SYNC_SETTING = `${PRE_FIX}SYNC_SETTING`;
export const SHOW_ADD_DAYOFF = `${PRE_FIX}SHOW_ADD_DAYOFF`;
export const CLOSE_DAYOFF = `${PRE_FIX}CLOSE_DAYOFF`;
export const SHOW_EDIT_DAYOFF = `${PRE_FIX}SHOW_EDIT_DAYOFF`;
export const GET_SYMBOL_LIST = `${PRE_FIX}GET_SYMBOL_LIST`;
export const ADD_DAYOFF_SUBMIT = `${PRE_FIX}ADD_DAYOFF_SUBMIT`;
export const ENABLE_DAYOFF = `${PRE_FIX}ENABLE_DAYOFF`;
export const DISABLE_DAYOFF = `${PRE_FIX}DISABLE_DAYOFF`;
export const EDIT_DAYOFF_SUBMIT = `${PRE_FIX}EDIT_DAYOFF_SUBMIT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const getServer = createAction(
  GET_SERVER,
  () => get({
    url: '/v2/os/products/vendor/MT4',
    data: {
      timezone: 1
    }
  })
);

export const serverChange = createAction(
  SERVER_CHANGE,
  serverId => serverId
);

export const getServerDayOffList = createAction(
  GET_SERVER_DAY_OFF_LIST,
  options => get({
    url: `/v2/os/products/holiday/${options.serverId}`,
    data: {
      page: options.page,
      pageSize: options.pageSize
    }
  })
);

export const syncSetting = createAction(
  SYNC_SETTING,
  serverId => post({
    url: `/v2/os/products/holiday/sync/${serverId}`
  })
);

export const showAddDayoff = createAction(
  SHOW_ADD_DAYOFF
);

export const closeDayoff = createAction(
  CLOSE_DAYOFF
);

export const getSymbolList = createAction(
  GET_SYMBOL_LIST,
  serverId => get({
    url: `/v2/os/products/symbol/${serverId}`
  })
);

export const addDayOffSubmit = createAction(
  ADD_DAYOFF_SUBMIT,
  (serverId, formdata) => post({
    url: `/v2/os/products/holiday/${serverId}`,
    data: { ...formdata }
  })
);

export const editDayOffSubmit = createAction(
  EDIT_DAYOFF_SUBMIT,
  (serverId, formdata) => put({
    url: `/v2/os/products/holiday/${serverId}`,
    data: { ...formdata }
  })
);

export const enableDayoff = createAction(
  ENABLE_DAYOFF,
  dayoffId => post({
    url: `/v2/os/products/holiday/enable/${dayoffId}`
  }).then(res => {
    return Promise.resolve({
      ...res,
      data: { id: dayoffId }
    });
  })
);

export const disableDayoff = createAction(
  DISABLE_DAYOFF,
  dayoffId => post({
    url: `/v2/os/products/holiday/disable/${dayoffId}`
  }).then(res => {
    return Promise.resolve({
      ...res,
      data: { id: dayoffId }
    });
  })
);

export const showEditDayoff = createAction(
  SHOW_EDIT_DAYOFF,
  dayoff => ({ dayoff })
);

