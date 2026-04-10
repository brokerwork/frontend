import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TW_MOBILE_';
export const GET_PRODUCT_DETAIL = `${PRE_FIX}GET_PRODUCT_DETAIL`;
export const GET_MONTH_CHARGE = `${PRE_FIX}GET_MONTH_CHARGE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getProductDetail = createAction(
  GET_PRODUCT_DETAIL,
  () => get({
    url: '/v2/os/products/tm'
  })
);

export const getMonthCharge = createAction(
  GET_MONTH_CHARGE,
  () => get({
    url: '/v2/os/products/app/consume/transaction/overview'
  })
);