import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";
import { CONNECTOR_TYPE, STATUS_TYPE } from "../constant";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "BROKER_CONNECTOR_SETTING_";
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_CURRENT_NO = `${PRE_FIX}GET_CURRENT_NO`;
export const DISCONNECT = `${PRE_FIX}DISCONNECT`;
export const CONNECT = `${PRE_FIX}CONNECT`;
export const CHECK_CONNECTOR = `${PRE_FIX}CHECK_CONNECTOR`;
export const UPDATE_CONNECTOR = `${PRE_FIX}UPDATE_CONNECTOR`;
export const SET_CONNECTOR_ORDER = `${PRE_FIX}SET_CONNECTOR_ORDER`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getServerList = createAction(GET_SERVER_LIST, () => {
  return get({
    url: "/v1/ops/product/deploy/vendor/connector/all/sc"
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return Promise.resolve({
      ...res,
      data: res.data.map(item => {
        return {
          ...item,
          _type: `${item.vendor === "CTRADER" ? "cTrader" : item.vendor} ${
            (CONNECTOR_TYPE.find(type => type.value === item.type) || {}).label
          }`,
          _status:
            STATUS_TYPE.find(
              type =>
                type.value === item.status && type.vendor.includes(item.vendor)
            ) ||
            STATUS_TYPE.find(
              type => type.value === 0 && type.vendor.includes(item.vendor)
            ) ||
            {}
        };
      })
    });
  });
});

export const getCurrentNo = createAction(GET_CURRENT_NO, connector => {
  if (connector.type !== "real") {
    return 0;
  }

  return get({
    url: `/v1/ops/product/deploy/${connector.vendor}/connector/${
      connector.serverId
    }/no`
  });
});

export const disconnect = createAction(DISCONNECT, serverId =>
  post({
    url: `/v1/ops/product/deploy/vendor/disconnect/${serverId}`
  })
);

export const connect = createAction(CONNECT, serverId =>
  post({
    url: `/v1/ops/product/deploy/vendor/connect/${serverId}`
  })
);

export const checkConnector = createAction(CHECK_CONNECTOR, connector =>
  post({
    url: "/v1/ops/product/deploy/vendor/connector/check",
    data: connector
  })
);

export const updateConnector = createAction(UPDATE_CONNECTOR, connector =>
  post({
    url: "/v1/ops/product/deploy/vendor/connector/update",
    data: connector
  })
);

export const setConnectorOrder = createAction(SET_CONNECTOR_ORDER, ids =>
  post({
    url: `/v1/ops/product/deploy/vendor/order?ids=${ids}`
  })
);
