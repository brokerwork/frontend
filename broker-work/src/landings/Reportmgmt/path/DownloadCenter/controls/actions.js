import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'REPORT_DOWNLOAD_CENTER';
export const GET_DOWNLOAD_LIST = `${PRE_FIX}GET_DOWNLOAD_LIST`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const REBUILD_DOWNLOAD = `${PRE_FIX}REBUILD_DOWNLOAD`;
export const CHECK_DOWNLOAD = `${PRE_FIX}CHECK_DOWNLOAD`;
export const DELETE_DOWNLOADS = `${PRE_FIX}DELETE_DOWNLOADS`;

export const downloadPageSizeKey = 'download_center_list';

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getDownloadList = createAction(
  GET_DOWNLOAD_LIST,
  ({ pageNo = 1, pageSize = 10 }) => dispatch => {
    dispatch({
      type: GET_DOWNLOAD_LIST,
      payload: post({
        url: '/v1/report/sta/download/list',
        data: {
          nowPage: pageNo,
          pageSize: pageSize
        }
      }).then(res => {
        if (res.result && res.data && res.data.list) {
          dispatch(updateUpdateTime(res.time));
        }
        return Promise.resolve(res);
      })
    });
  }
);

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

export const rebuildDownload = createAction(REBUILD_DOWNLOAD, id =>
  post({
    url: `/v1/report/sta/download/redo/${id}`
  })
);

export const checkDownload = createAction(CHECK_DOWNLOAD, id =>
  post({
    url: `/v1/report/sta/download/check/${id}`
  })
);

export const deletDownloads = createAction(DELETE_DOWNLOADS, ids =>
  post({ url: `/v1/report/sta/download/delete`, data: { ids } })
);
