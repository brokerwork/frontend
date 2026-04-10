import { handleActions } from 'redux-actions';

import {
  GET_DOWNLOAD_LIST,
  UPDATE_UPDATE_TIME,
  UPDATE_PAGINATION,
  downloadPageSizeKey
} from './actions';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';

export const downloadList = handleActions(
  {
    [GET_DOWNLOAD_LIST]: (state, { type, payload }) => payload
  },
  []
);

// 列表更新时间
export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

//当前分页状态
export const current_pagination = handleActions(
  {
    [GET_DOWNLOAD_LIST]: (state, { payload }) => {
      const size = payload.size;
      if (size && getPageSize(downloadPageSizeKey) !== size) {
        setPageSize(downloadPageSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (payload['pageSize'] && getPageSize(downloadPageSizeKey) !== size) {
        setPageSize(downloadPageSizeKey, size);
      }

      return {
        pageNo: payload['pageNo'],
        pageSize: payload['pageSize'],
        total: payload['total']
      };
    }
  },
  {
    pageNo: 1,
    pageSize: 50,
    total: 0
  }
);
