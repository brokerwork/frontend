import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { PRODUCT_LIST } from '../constants';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'PRODUCT_DEPLOY_';

export const ADD_CONTRACT = `${PRE_FIX}ADD_CONTRACT`;

export const updateDeploy = createAction(ADD_CONTRACT, data =>
  post({
    url: '/v1/custom/product/deploy/update',
    data: { ...data, enabled: true }
  })
);
