import { handleActions } from 'redux-actions';
import {
  GET_VIDEO,
  MODIFY_PARAMS,
  GET_LECTURERS,
  GET_VIDEO_RECORDS,
  GET_VIDEO_RECORD_RECYCLE,
  SAVE_UPLOAD_VIDEOS,
  UPDATE_SELECTED_VIDEO,
  GET_TENANT_RIGHTS,
  GET_SIGNATURE
} from './actions';

export const videos = handleActions(
  {
    [GET_VIDEO]: (state, { payload }) => payload.list
  },
  []
);

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload
  },
  {
    page: 1,
    size: 20,
    sortby: 'createTime',
    orderDesc: true
  }
);

export const navigationInfo = handleActions(
  {
    [GET_VIDEO]: (state, { payload }) => ({
      pageNo: payload.pager,
      pageSize: payload.size,
      total: payload.total
    })
  },
  {
    pageo: 1,
    pageSize: 20,
    total: 0
  }
);

export const currentSignature = handleActions(
  {
    [GET_SIGNATURE]: (state, { payload }) => payload
  },
  ''
);

export const lecturers = handleActions(
  {
    [GET_LECTURERS]: (state, { payload }) => payload
  },
  []
);

export const videoRecords = handleActions(
  {
    [GET_VIDEO_RECORDS]: (state, { payload }) => payload.list
  },
  []
);

export const videoRecycles = handleActions(
  {
    [GET_VIDEO_RECORD_RECYCLE]: (state, { payload }) => payload
  },
  []
);

export const currenVideos = handleActions(
  {
    [SAVE_UPLOAD_VIDEOS]: (state, { payload }) => payload
  },
  []
);

export const selectedVideoIds = handleActions(
  {
    [UPDATE_SELECTED_VIDEO]: (state, { type, payload }) => {
      return payload.map(video => video.id);
    }
  },
  []
);

export const selectedVideos = handleActions(
  {
    [UPDATE_SELECTED_VIDEO]: (state, { type, payload }) => payload
  },
  []
);

export const tenantRights = handleActions(
  {
    [GET_TENANT_RIGHTS]: (state, { type, payload }) => payload
  },
  {}
);
