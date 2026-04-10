import { handleActions } from "redux-actions";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_SERVER,
  SERVER_CHANGE,
  GET_SERVER_DAY_OFF_LIST,
  SHOW_ADD_DAYOFF,
  CLOSE_DAYOFF,
  SHOW_EDIT_DAYOFF,
  GET_SYMBOL_LIST,
  ENABLE_DAYOFF,
  DISABLE_DAYOFF
} from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const server = handleActions(
  {
    [GET_SERVER]: (state, { payload }) => {
      return payload;
    }
  },
  []
);

export const activeServerId = handleActions(
  {
    [GET_SERVER]: (state, { payload }) => {
      let id;
      if (payload && payload.length) {
        id = payload[0].serverId;
      }
      return id;
    },
    [SERVER_CHANGE]: (state, { payload }) => payload
  },
  ""
);

const serverDayOffListEnableProcess = (id, list) => {
  const newList = list.map(item => {
    if (item.id === id) {
      return Object.assign({}, item, {
        enabled: !item.enabled
      });
    }
    return item;
  });
  return newList;
};

export const serverDayOffList = handleActions(
  {
    [GET_SERVER_DAY_OFF_LIST]: (state, { payload }) => {
      return { ...payload, page: payload.pager, pageSize: payload.size };
    },
    [ENABLE_DAYOFF]: (state, { payload }) => {
      return Object.assign({}, state, {
        list: serverDayOffListEnableProcess(payload.id, state.list)
      });
    },
    [DISABLE_DAYOFF]: (state, { payload }) => {
      return Object.assign({}, state, {
        list: serverDayOffListEnableProcess(payload.id, state.list)
      });
    }
  },
  {
    page: 1,
    pageSize: 10
  }
);

export const addDayoff = handleActions(
  {
    [SHOW_ADD_DAYOFF]: () => true,
    [SHOW_EDIT_DAYOFF]: () => true,
    [CLOSE_DAYOFF]: () => false
  },
  false
);

export const symbolList = handleActions(
  {
    [GET_SYMBOL_LIST]: (state, { payload }) => {
      return payload.map(val => {
        return {
          value: val.originSymbol,
          label: val.originSymbol
        };
      });
    }
  },
  []
);

export const dayoffEditData = handleActions(
  {
    [SHOW_ADD_DAYOFF]: () => ({
      date: "2017.01.01",
      enabled: true,
      start: "0:00",
      end: "23:59",
      name: "",
      symbols: "",
      yearRepeat: true
    }),
    [SHOW_EDIT_DAYOFF]: (state, { payload }) => {
      return payload.dayoff;
    }
  },
  {}
);
