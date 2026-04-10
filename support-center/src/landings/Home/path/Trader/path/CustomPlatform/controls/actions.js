import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_CUSTOM_PLATFORM_SETTING_';

export const GET_LIST = `${PRE_FIX}GET_LIST`;
export const SET_PLATFORM = `${PRE_FIX}SET_PLATFORM`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------

//获取自定义平台列表
export const getList = createAction(GET_LIST, () =>
  get({
    url: '/v1/ops/product/structural/list'
  })
);

//设置（新加/编辑）自定义平台
export const setPlatform = createAction(SET_PLATFORM, data => post({ url: '/v1/ops/product/structural/upsert', data }));
