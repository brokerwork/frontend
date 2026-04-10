import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'MESSAGE_';
export const GET_MESSAGE_DETAILS = `${PRE_FIX}GET_MESSAGE_DETAILS`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getMessageDetails = createAction(GET_MESSAGE_DETAILS, messageId =>
  post({
    url: `/v1/message/${messageId}`
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    return Promise.resolve({
      ...res,
      data: res.data[0]
    });
  })
);
