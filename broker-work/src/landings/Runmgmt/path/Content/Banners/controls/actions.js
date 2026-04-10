import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// --------------------------------------------- action typs
const PRE_FIX = 'APP_CONTENT_ARTICLE_';
export const GET_COLUMNS = `${PRE_FIX}GET_COLUMNS`;
export const SORT_LIST = `${PRE_FIX}SORT_LIST`;
export const EDIT_COLUMN_BANNERS = `${PRE_FIX}EDIT_COLUMN_BANNERS`;

export const getColumns = createAction(GET_COLUMNS, () =>
  get({
    url: '/v1/app/navigation'
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
