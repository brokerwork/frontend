import { createAction } from 'redux-actions';
import { get, post, put, dele } from 'utils/ajax';
const DATE_FORMAT_STYLE = 'YYYYMMDD';
import moment from 'moment';

// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'VIDEO_LIVE_';
export const GET_LIVES = `${PRE_FIX}GET_LIVES`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const CREATE_LIVE = `${PRE_FIX}CREATE_LIVE`;
export const GET_LECTURERS = `${PRE_FIX}GET_LECTURERS`;
export const CREATE_LECTURER = `${PRE_FIX}CREATE_LECTURER`;
export const GET_LIVE_DETAIL = `${PRE_FIX}GET_LIVE_DETAIL`;
export const UPDATE_LIVE = `${PRE_FIX}UPDATE_LIVE`;
export const DELETE_LIVE = `${PRE_FIX}DELETE_LIVE`;
export const GET_LECTURERS_LIST = `${PRE_FIX}GET_LECTURERS_LIST`;
export const SAVE_LIST_TYPE = `${PRE_FIX}SAVE_LIST_TYPE`;
export const UPDATE_SELECTED_LIVE = `${PRE_FIX}UPDATE_SELECTED_LIVE`;
export const MODIFY_TA_PARAMS = `${PRE_FIX}MODIFY_TA_PARAMS`;
export const GET_TA_USERS = `${PRE_FIX}GET_TA_USERS`;
export const GET_ADMIN_LIST = `${PRE_FIX}GET_ADMIN_LIST`;
export const UPDATE_ADMIN = `${PRE_FIX}UPDATE_ADMIN`;
export const UPDATE_TUSER = `${PRE_FIX}UPDATE_TUSER`;
export const STOP_LIVE = `${PRE_FIX}STOP_LIVE`;
export const GET_TENANT_RIGHTS = `${PRE_FIX}GET_TENANT_RIGHTS`;

// ---------------------------------------------
// action types
// ---------------------------------------------

export const getLives = createAction(GET_LIVES, data =>
  get({
    url: '/v1/video/live/list',
    data
  })
);

export const getAdminList = createAction(GET_ADMIN_LIST, () =>
  get({
    url: '/v1/ta/user/mng/commentAdmin'
  })
);

export const updateAdmin = createAction(UPDATE_ADMIN, data =>
  post({
    url: '/v1/ta/user/mng/commentAdmin',
    data: data
  })
);

export const getLiveDetail = createAction(GET_LIVE_DETAIL, id =>
  get({
    url: `/v1/video/live?id=${id}`
  })
);

export const modifySearchParams = createAction(
  MODIFY_PARAMS,
  params => dispatch => {
    dispatch({
      type: MODIFY_PARAMS,
      payload: params
    });
    dispatch(getLives(params));
  }
);

export const createLive = createAction(CREATE_LIVE, data =>
  post({
    url: '/v1/video/live',
    data: data
  })
);

export const updateLive = createAction(UPDATE_LIVE, data =>
  put({
    url: '/v1/video/live',
    data: data
  })
);

export const deleteLive = createAction(DELETE_LIVE, data =>
  dele({
    url: '/v1/video/live',
    data: {
      id: data
    }
  })
);

export const createLecturer = createAction(CREATE_LECTURER, data =>
  post({
    url: '/v1/video/lecturer',
    data: data
  })
);

export const saveListType = createAction(SAVE_LIST_TYPE, type => type);

export const getLecturers = createAction(GET_LECTURERS, () =>
  get({
    url: '/v1/video/lecturer/list',
    data: {
      page: 1,
      size: 20
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    return Promise.resolve({
      ...res,
      data: res.data.list.map(item => {
        return {
          label: item.name,
          value: item.id
        };
      })
    });
  })
);

export const getLecturerList = createAction(GET_LECTURERS_LIST, () =>
  get({
    url: '/v1/video/lecturer/list',
    data: {
      page: 1,
      size: 100
    }
  })
);

//多选
export const updateSelectedLive = createAction(
  UPDATE_SELECTED_LIVE,
  live => live
);
//更新列表请求参数
export const modifyParams = createAction(MODIFY_TA_PARAMS, params => params);
export const updateTausers = createAction(UPDATE_TUSER, user => user);
export const getTaUsers = createAction(
  GET_TA_USERS,
  ({ startDate, endDate, page, size, type, value, sort, order }) => {
    const from = moment(startDate).format(DATE_FORMAT_STYLE);
    const to = moment(endDate).format(DATE_FORMAT_STYLE);
    return get({
      url: `/v1/ta/user/mng/list?from=${from}&to=${to}&page=${page}&size=${size}&type=${type}&value=${value}&sort=${sort}&order=${order}`
    });
  }
);

export const stopLive = createAction(STOP_LIVE, id =>
  post({
    url: '/v1/video/live/stop',
    data: {
      id: id
    }
  })
);

export const getTenantRights = createAction(GET_TENANT_RIGHTS, () =>
  get({
    url: '/v1/video/rights'
  })
);
