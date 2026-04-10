import { handleActions } from 'redux-actions';
import {
  GET_LIVES,
  MODIFY_PARAMS,
  GET_LECTURERS,
  GET_LIVE_DETAIL,
  GET_LECTURERS_LIST,
  SAVE_LIST_TYPE,
  UPDATE_SELECTED_LIVE,
  MODIFY_TA_PARAMS,
  GET_TA_USERS,
  GET_ADMIN_LIST,
  UPDATE_TUSER,
  GET_TENANT_RIGHTS
} from './actions';
import { SEARCH_TYPES } from '../../constants';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { dateRange } from 'utils/config';
import i18n from 'utils/i18n';
const DEFAULT_SEARCH_PARAMS = {
  startDate: dateRange.all.start,
  endDate: dateRange.all.end,
  page: 1,
  size: __getPageSize__(pageSizeKey),
  type: '',
  value: '',
  sort: 'registerTime',
  order: 'DESC'
};
const pageSizeKey = 'ta_user_search_';
export const lives = handleActions(
  {
    [GET_LIVES]: (state, { payload }) => payload.list
  },
  []
);

export const lecturersList = handleActions(
  {
    [GET_LECTURERS_LIST]: (state, { payload }) => payload.list
  },
  []
);

export const currentLive = handleActions(
  {
    [GET_LIVE_DETAIL]: (state, { payload }) => payload
  },
  {}
);

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload
  },
  {
    page: 1,
    size: 20,
    state: 'NOTFINISHED',
    subject: '',
    pubState: 'PUBBED',
    sortby: 'createTime',
    orderDesc: true
  }
);

export const navigationInfo = handleActions(
  {
    [GET_LIVES]: (state, { payload }) => ({
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

export const lecturers = handleActions(
  {
    [GET_LECTURERS]: (state, { payload }) => payload
  },
  []
);

export const listType = handleActions(
  {
    [SAVE_LIST_TYPE]: (state, { payload }) => payload
  },
  { label: i18n['video.video_root.video_list'], value: 'LIVE' }
);

export const lecturerNavigationInfo = handleActions(
  {
    [GET_LECTURERS_LIST]: (state, { payload }) => ({
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

export const selectedLiveIds = handleActions(
  {
    [UPDATE_SELECTED_LIVE]: (state, { type, payload }) => {
      return payload;
    }
  },
  []
);

export const selectedLives = handleActions(
  {
    [UPDATE_SELECTED_LIVE]: (state, { type, payload }) => payload
  },
  []
);
export const searchTypes = handleActions({}, SEARCH_TYPES);
export const taParams = handleActions(
  {
    [MODIFY_TA_PARAMS]: (state, { type, payload }) => payload
  },
  DEFAULT_SEARCH_PARAMS
);

export const taUsers = handleActions(
  {
    [GET_TA_USERS]: (state, { type, payload }) => payload.list,
    [UPDATE_TUSER]: (state, { type, payload }) => payload
  },
  []
);

export const adminList = handleActions(
  {
    [GET_ADMIN_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const tenantRights = handleActions(
  {
    [GET_TENANT_RIGHTS]: (state, { type, payload }) => payload
  },
  {}
);
