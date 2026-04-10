import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'SYMBOL_GROUP_SETTINGS_';

export const CREATE_GROUP = `${PRE_FIX}CREATE_GROUP`;
export const REMOVE_GROUP = `${PRE_FIX}CREATE_GROUP`;
export const UPDATE_GROUP = `${PRE_FIX}UPDATE_GROUP`;
export const SELECT_GROUP = `${PRE_FIX}SELECT_GROUP`;
export const UPDATE_SELECTED_GROUP = `${PRE_FIX}UPDATE_SELECTED_GROUP`;
export const GET_MT5_SYMBOLS = `${PRE_FIX}GET_MT5_SYMBOLS`;
export const SORT_GROUP =  `${PRE_FIX}SORT_GROUP`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const createGroup = createAction(CREATE_GROUP, group =>
  post({
    url: '/v2/report/setting/symbolGroup/save',
    data: group
  })
);

export const removeGroup = createAction(REMOVE_GROUP, id =>
  post({
    url: `/v1/report/setting/symbolGroup/delete/${id}`
  })
);

export const updateGroup = createAction(UPDATE_GROUP, group =>
  post({
    url: `/v2/report/setting/symbolGroup/update`,
    data: group
  })
);

export const selectGroup = createAction(SELECT_GROUP, group => group);

export const updateSelectedGroup = createAction(
  UPDATE_SELECTED_GROUP,
  group => group
);

export const getMt5Symbols = createAction(GET_MT5_SYMBOLS, (vendor, serverId) =>
  get({
    url: '/v1/manager/meta/symbols',
    header: {
      'x-api-vendor': vendor,
      'x-api-serverid': serverId
    },
    data: {
      searchType: 'ALL'
    }
  })
);

export const sortGroup = createAction(SORT_GROUP, groups =>
  post({
    url: '/v2/report/setting/symbolGroup/order',
    data: groups
  })
);