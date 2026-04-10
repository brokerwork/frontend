import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'CUTOMER_SERVICE_CONTACT_';
export const GET_DATA = `${PRE_FIX}GET_DATA`;
export const SUBMIT = `${PRE_FIX}SUBMIT`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const getData = createAction(
  GET_DATA,
  () => get({
    url: '/v1/ops/product/contacts/TM'
  })
);

export const submitData = createAction(
  SUBMIT,
  (data) => post({
    url: '/v1/ops/product/contacts/TM',
    data
  })
);