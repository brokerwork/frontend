import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'DEPOSIT_';
export const GET_DEPOSIT_LIST = `${PRE_FIX}GET_DEPOSIT_LIST`;
export const GET_DEPOSIT_DETAIL = `${PRE_FIX}GET_DEPOSIT_DETAIL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getDepositList = createAction(GET_DEPOSIT_LIST, () =>
  get({ url: '/v2/account/import/excel/withdraw/list' })
);

export const getDepositDetail = createAction(GET_DEPOSIT_DETAIL, id =>
  get({
    url: `/v2/account/import/excel/deposit/${id}/detail`
  })
);
