import { createAction } from 'redux-actions';
import { get, post, put, dele } from 'utils/ajax';

// --------------------------------------------- action typs
const PRE_FIX = 'APP_CONTENT_ARTICLE_EDIT_';
export const GET_ARTICLE = `${PRE_FIX}GET_ARTICLE`;
export const SAVE_ARTICLE = `${PRE_FIX}SAVE_ARTICLE`;

export const getArticleById = createAction(GET_ARTICLE, id =>
  get({
    url: `/v1/app/article/${id}`
  })
);

export const saveArticle = createAction(SAVE_ARTICLE, data =>
  post({
    url: '/v1/app/article',
    data
  })
);
