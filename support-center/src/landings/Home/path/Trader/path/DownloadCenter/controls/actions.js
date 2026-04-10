import {
  createAction
} from 'redux-actions';
import {
  get,
  post
} from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_DOWNLOAD_CENTER';
export const GET_DOWNLOAD_LIST = `${PRE_FIX}GET_DOWNLOAD_LIST`;
export const OPERATE_DOWNLOAD_ITEM = `${PRE_FIX}OPERATE_DOWNLOAD_ITEM`;
export const DELETE_DOWNLOAD_ITEM = `${PRE_FIX}DELETE_DOWNLOAD_ITEM`;
export const FORM_EDIT_TARGET = `${PRE_FIX}FORM_EDIT_TARGET`;
export const DOWNLOADER_FORM = `${PRE_FIX}DOWNLOADER_FORM`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取下载链接列表
export const getDownloadList = createAction(
  GET_DOWNLOAD_LIST,
  () => get({
    url: '/v1/ops/product/conf/download/center'
  })
);

// 添加或编辑下载链接
export const operateDownloadItem = createAction(
  OPERATE_DOWNLOAD_ITEM,
  (data) => post({
    url: '/v1/ops/product/conf/download/center',
    data: {
      ...data,
      productId: 'TW'
    }
  })
)

// 删除下载链接
export const deleteDownloadItemByID = createAction(
  DELETE_DOWNLOAD_ITEM,
  (dlsId)=> {
    return post({
      url: `/v1/ops/product/conf/remove/download?dlsId=${dlsId}&productId=TW`
    })
  }
)

export const setEditTargetData = createAction(
  FORM_EDIT_TARGET,
  (formData) => !formData ? {} : formData
)
