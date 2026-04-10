import { handleActions } from 'redux-actions';
import _ from 'lodash';

import {
  GET_TYPE_FIELD,
  GET_TYPE_FIELD_EDIT,
  ON_FIELD_SELECT,
  ON_FIELD_REMOVE,
  ON_FIELD_DRAG,
  ON_USER_RANGE_CHANGE,
  ON_NAME_CHANGE,
  ON_SORT_CHANGE,
  ON_FIELD_NAME_CHANGE,
  GET_FIELDS_DETAIL
} from './actions';

export const typeFields = handleActions(
  {
    [GET_TYPE_FIELD]: (state, { type, payload }) => payload,
    [GET_TYPE_FIELD_EDIT]: (state, { type, payload }) => payload
  },
  []
);

export const fieldsDetail = handleActions(
  {
    [GET_FIELDS_DETAIL]: (state, { type, payload }) => payload
  },
  {}
);

function arrTans(arr, oldIndex, newIndex) {
  const oldId = arr[oldIndex];
  arr.splice(oldIndex, 1);
  arr.splice(newIndex, 0, oldId);
  return arr;
}

export const typeFieldsSelected = handleActions(
  {
    [GET_TYPE_FIELD]: (state, { type, payload }) =>
      _.filter(payload, p => p.required || p.selected),
    [GET_FIELDS_DETAIL]: (state, { type, payload }) =>
      _.get(payload, 'fields', []),
    [ON_FIELD_SELECT]: (state, { type, payload }) => [...state, payload],
    [ON_FIELD_REMOVE]: (state, { type, payload }) =>
      _.filter(state, p => p.fieldId !== payload.fieldId),
    [ON_FIELD_DRAG]: (state, { type, payload }) => {
      const { oldIndex, newIndex } = payload;
      const copyed = [].concat(state);
      const draged = arrTans(copyed, oldIndex, newIndex);
      return draged;
    },
    [ON_FIELD_NAME_CHANGE]: (state, { type, payload }) => {
      return _.map(state, field => {
        if (field.fieldId === payload.fieldId) {
          return payload;
        }
        return field;
      });
    }
  },
  []
);

export const reportName = handleActions(
  {
    [ON_NAME_CHANGE]: (state, { type, payload = '' }) => payload,
    [GET_FIELDS_DETAIL]: (state, { type, payload }) =>
      _.get(payload, 'reportName', '')
  },
  ''
);

export const userRange = handleActions(
  {
    [ON_USER_RANGE_CHANGE]: (state, { type, payload }) => payload,
    [GET_FIELDS_DETAIL]: (state, { type, payload }) =>
      _.pick(payload, 'visibleScope', 'scopeUser')
  },
  {
    visibleScope: 'UserMySelfVisible',
    scopeUser: null
  }
);

export const sortData = handleActions(
  {
    [GET_TYPE_FIELD]: (state, { type, payload }) => {
      const sortField = _.find(payload, p => (p.required || p.selected) && p.sortable);
      if (sortField) {
        return {
          sortingColumn: sortField.fieldId,
          sortingDirection: 'DESC'
        };
      } else {
        return state;
      }
    },
    [ON_SORT_CHANGE]: (state, { type, payload }) => {
      if (payload === state.sortingColumn) {
        return {
          ...state,
          sortingDirection: state.sortingDirection === 'DESC' ? 'ASC' : 'DESC'
        };
      } else {
        return {
          sortingColumn: payload,
          sortingDirection: 'DESC'
        };
      }
    },
    [GET_FIELDS_DETAIL]: (state, { type, payload }) =>
      _.pick(payload, 'sortingColumn', 'sortingDirection')
  },
  { sortingColumn: '', sortingDirection: '' }
);
