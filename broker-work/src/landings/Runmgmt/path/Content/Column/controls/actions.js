import { createAction } from 'redux-actions';
import { get, post, put, dele } from 'utils/ajax';

// --------------------------------------------- action typs
const PRE_FIX = 'APP_CONTENT_ARTICLE_';
export const GET_COLUMNS = `${PRE_FIX}GET_COLUMNS`;
export const SORT_LIST = `${PRE_FIX}SORT_LIST`;
export const ENABLE_COLUMN = `${PRE_FIX}ENABLE_COLUMN`;
export const EDIT_COLUMN_NAME = `${PRE_FIX}EDIT_COLUMN_NAME`;
export const EDIT_COLUMN_BANNERS = `${PRE_FIX}EDIT_COLUMN_BANNERS`;

export const getColumns = createAction(GET_COLUMNS, () =>
  get({
    url: '/v1/app/navigation'
  })
);

export const enableColumn = createAction(ENABLE_COLUMN, ({ code, status }) =>
  post({
    url: `/v1/app/navigation/status/${code}/${status}`
  })
);

export const editColumnTitle = createAction(
  EDIT_COLUMN_NAME,
  ({ code, name }) =>
    post({
      url: '/v1/app/navigation',
      data: { code, name }
    })
);

export const editColumnBanners = createAction(
  EDIT_COLUMN_BANNERS,
  ({ code, banners }) =>
    post({
      url: '/v1/app/navigation',
      data: { code, banners }
    })
);

export const sortList = createAction(
  SORT_LIST,
  (newList, oldList) => dispatch => {
    const list = [];
    const enableList = newList.forEach(item => {
      if (!item.enable) return;
      list.push(item.code);
    });
    post({
      url: `/v1/app/navigation/move?codes=${list.join(',')}`
    }).then(r => {
      if (r.result) {
        dispatch(getColumns());
      } else {
        dispatch({ type: SORT_LIST, payload: oldList });
      }
    });
    dispatch({ type: SORT_LIST, payload: newList });
  }
);