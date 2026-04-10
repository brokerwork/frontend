import { handleActions } from 'redux-actions';
import {
  CONTRACT_FIELDS_MAP,
  PRODUCT_LIST,
  CONTRACT_FIELDS_MEDIATOR
} from '../constants';
import { deepCopy } from 'utils/simpleDeepCopy';

import { GET_PRODUCT_LIST, TOGGLE_HAS_MEDIATOR } from './actions';
import { OPPORTUNITIES_OF_CUSTOMER_BY_ID } from '../../Customers/controls/actions';

export const productList = handleActions({}, PRODUCT_LIST);

export const contractFieldsMap = handleActions(
  {
    [OPPORTUNITIES_OF_CUSTOMER_BY_ID]: (state, { type, payload }) => ({
      ...state,
      opportunityId: {
        ...state.opportunityId,
        optionList: payload
          .filter(item => item.salesStage === '5')
          .map(item => ({
            label: item.opportunityName,
            value: item.opportunityId
          }))
      }
    }),
    [TOGGLE_HAS_MEDIATOR]: (state, { payload }) => {
      console.log(state);
      if (payload) {
        return { ...state, ...CONTRACT_FIELDS_MEDIATOR };
      } else {
        let newState = { ...state };
        for (let k in CONTRACT_FIELDS_MEDIATOR) {
          // delete newState[k];
          newState[k] = undefined;
        }

        return newState;
      }
    }
    //todo 销售机会列表
  },
  CONTRACT_FIELDS_MAP
);
