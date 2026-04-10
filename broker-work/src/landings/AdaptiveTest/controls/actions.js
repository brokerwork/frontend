import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'ADAPTIVE_TEST_';
export const GET_TEST_RESULT = `${PRE_FIX}GET_TEST_RESULT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getTestResult = createAction(
  GET_TEST_RESULT,
  (id, idType = 'ACCOUNT', serverId, vendor) =>
    get({
      url: `/v2/account/owner/${id}/appropriatenessTestInfo/forTask?idType=${idType}`,
      header:
        idType === 'ACCOUNT'
          ? {
              'x-api-vendor': vendor,
              'x-api-serverid': serverId
            }
          : null
    })
);
