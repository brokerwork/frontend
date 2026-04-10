import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CUSTOM_MENU';
export const GET_MENU_DETAIL = `${PRE_FIX}GET_MENU_DETAIL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

//删除用户
export const getMenuDetail = createAction(GET_MENU_DETAIL, id =>
  post({
    url: `/v1/product/menu/broker/${id}`
  })
);
