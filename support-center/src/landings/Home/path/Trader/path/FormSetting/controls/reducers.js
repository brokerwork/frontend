import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_FIELDS, CHOOSE_FIELDS, SORT, DEL, GET_PLATS } from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const fieldList = handleActions(
  {
    [GET_FIELDS]: (state, { payload }) => {
      const poolFields = payload.poolFields.filter(el => !el.required);
      const accountFields = payload.poolFields.filter(el => el.required);
      return {
        accountFields: [...payload.accountFields, ...accountFields],
        poolFields: poolFields,
        functionEnable: payload.functionEnable
      };
    },
    [CHOOSE_FIELDS]: (state, { payload }) => {
      const accountFields = state.poolFields.filter(el => {
        return [...payload].includes(el.uuid);
      });
      const poolFields = state.poolFields.filter(el => {
        return ![...payload].includes(el.uuid);
      });
      return {
        accountFields: [...state.accountFields, ...accountFields],
        poolFields: poolFields,
        functionEnable: state.functionEnable
      };
    },
    [SORT]: (state, { payload }) => {
      return {
        accountFields: payload,
        poolFields: state.poolFields,
        functionEnable: state.functionEnable
      };
    },
    [DEL]: (state, { payload }) => {
      const accountFields = [...state.accountFields];
      const item = accountFields.splice(payload, 1);
      const poolFields = [...state.poolFields];
      poolFields.unshift(item[0]);
      return {
        accountFields,
        poolFields,
        functionEnable: state.functionEnable
      };
    }
  },
  {}
);
export const plats = handleActions({ [GET_PLATS]: (state, { payload }) => payload }, []);
