import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
const PRE_FIX = 'TRADER_PLATMT4_SETTING_';
const GET_STRUCTUAL = `${PRE_FIX}GET_STRUCTUAL`;

export const getStructual = createAction(GET_STRUCTUAL, type =>
  get({
    url: '/v1/ops/product/conf/structural',
    data: {
      structural: type
    }
  })
);
