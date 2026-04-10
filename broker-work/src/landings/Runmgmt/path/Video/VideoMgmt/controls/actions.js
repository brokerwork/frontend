import { createAction } from 'redux-actions';
import { get, post, put, dele } from 'utils/ajax';
import i18n from 'utils/i18n';

// --------------------------------------------- action typs
// ---------------------------------------------
const PRE_FIX = 'VIDEO_UPLOAD_';
export const GET_VIDEO = `${PRE_FIX}GET_VIDEO`;
export const GET_VIDEO_DETAIL = `${PRE_FIX}GET_VIDEO_DETAIL`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const CREATE_RECORDS = `${PRE_FIX}CREATE_RECORDS`;
export const GET_LECTURERS = `${PRE_FIX}GET_LECTURERS`;
export const GET_VIDEO_RECORDS = `${PRE_FIX}GET_VIDEO_RECORDS`;
export const GET_VIDEO_RECORD_RECYCLE = `${PRE_FIX}GET_VIDEO_RECORD_RECYCLE`;
export const GET_SIGNATURE = `${PRE_FIX}GET_SIGNATURE`;
export const SAVE_UPLOAD_VIDEOS = `${PRE_FIX}SAVE_UPLOAD_VIDEOS`;
export const UPDATE_RECORDS = `${PRE_FIX}UPDATE_RECORDS`;
export const UPDATE_SELECTED_VIDEO = `${PRE_FIX}UPDATE_SELECTED_VIDEO`;
export const DELETE_VIDEO = `${PRE_FIX}DELETE_VIDEO`;
export const GET_TENANT_RIGHTS = `${PRE_FIX}GET_TENANT_RIGHTS`;
export const SET_FIELD_ID = `${PRE_FIX}SET_FIELD_ID`;
// --------------------------------------------- action types
// ---------------------------------------------

export const getVideo = createAction(GET_VIDEO, data =>
  get({
    url: '/v1/video/replay/list',
    data
  })
);

export const getVideoRecords = createAction(
  GET_VIDEO_RECORDS,
  ({ page, size }) =>
    get({
      url: `/v1/video/live/finished_list?page=${page}&size=${size}`
    })
);

export const modifySearchParams = createAction(
  MODIFY_PARAMS,
  params => dispatch => {
    dispatch({
      type: MODIFY_PARAMS,
      payload: params
    });
  }
);

export const deleteVideo = createAction(DELETE_VIDEO, data =>
  dele({
    url: '/v1/video/replay',
    data: {
      id: data
    }
  })
);

export const createRecords = createAction(CREATE_RECORDS, data =>
  post({
    url: '/v1/video/replay',
    data: data
  })
);

export const updateRecords = createAction(UPDATE_RECORDS, data =>
  put({
    url: '/v1/video/replay',
    data: data
  })
);

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

export const getVideoRecordRecycle = createAction(
  GET_VIDEO_RECORD_RECYCLE,
  ({ page, size }) =>
    get({
      url: `/v1/video/live/finished_list?page=${page}&size=${size}`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      return Promise.resolve({
        ...res,
        data: res.data.list.map(item => {
          return {
            label: item.subject,
            value: item.replayId,
            replayUrl: item.replayUrl
          };
        })
      });
    })
);

export const saveUploadVideos = createAction(
  SAVE_UPLOAD_VIDEOS,
  videos => videos
);

//多选
export const updateSelectedVideo = createAction(
  UPDATE_SELECTED_VIDEO,
  videos => videos
);

export const getTenantRights = createAction(GET_TENANT_RIGHTS, () =>
  get({
    url: '/v1/video/rights'
  })
);

export const setFieldId = createAction(SET_FIELD_ID, id =>
  get({
    url: `/v1/video/replay/update/info?replayId=${id}`
  })
);

export const getSignature = createAction(GET_SIGNATURE, () =>
  get({
    url: '/v1/video/replay/upload_sign'
  })
);
