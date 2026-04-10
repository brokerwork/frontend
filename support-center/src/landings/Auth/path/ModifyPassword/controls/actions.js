import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'MODIFY_PASSWORD_';
export const UPDATE = `${PRE_FIX}UPDATE`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const update = createAction(
  UPDATE,
  (data) => post({
    url: '/v1/pub/pwd/modify',
    data
  })
);