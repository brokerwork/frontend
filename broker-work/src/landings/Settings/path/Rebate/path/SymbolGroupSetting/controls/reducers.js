import { handleActions } from 'redux-actions';
import {
  SELECT_GROUP,
  UPDATE_SELECTED_GROUP,
  GET_MT5_SYMBOLS
} from './actions';

export const selected_group = handleActions(
  {
    [SELECT_GROUP]: (state, { type, payload }) => payload,
    [UPDATE_SELECTED_GROUP]: (state, { type, payload }) => payload
  },
  {
    name: '',
    symbols: []
  }
);

function parseMt5Symbol(symbols) {
  return symbols.map(symbol => {
    if (symbol.children) {
      symbol.path = `${symbol.path}\\`;
      symbol.children = parseMt5Symbol(symbol.children);
    }
    return symbol;
  });
}

export const mt5Symbols = handleActions(
  {
    [GET_MT5_SYMBOLS]: (state, { type, payload }) => {
      return parseMt5Symbol(payload);
    }
  },
  []
);
