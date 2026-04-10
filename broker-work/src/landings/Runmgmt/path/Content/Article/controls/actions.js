import { createAction } from 'redux-actions';
import { get, post, put, dele } from 'utils/ajax';

// --------------------------------------------- action typs
const PRE_FIX = 'APP_CONTENT_ARTICLE_';
export const GET_ARTICLES = `${PRE_FIX}GET_ARTICLES`;
export const REMOVE_ARTICLE = `${PRE_FIX}REMOVE_ARTICLE`;
export const ORDER_ARTICLE = `${PRE_FIX}ORDER_ARTICLE`;
export const SET_PARAMS = `${PRE_FIX}SET_PARAMS`;
export const SORT_LIST = `${PRE_FIX}SORT_LIST`;

export const getArticles = createAction(GET_ARTICLES, data =>
  get({
    url: '/v1/app/article',
    data: {
      keyword: data.keyword,
      pager: data.pager,
      pageSize: data.pageSize
    }
  })
);

export const removeArticle = createAction(REMOVE_ARTICLE, id =>
  dele({
    url: `/v1/app/article/${id}`
  })
);

export const setParams = createAction(SET_PARAMS, data => data);

export const sortList = createAction(SORT_LIST, data => data);

export const orderArticle = createAction(ORDER_ARTICLE, ({ id, order }) =>
  post({
    url: `/v1/app/article/move/${id}/${order}`
  })
);
