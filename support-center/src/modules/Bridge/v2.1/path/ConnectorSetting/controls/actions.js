import { createAction } from "redux-actions";
import { get, post, put, fetchDelete } from "utils/ajax";
import { getTenantId } from "utils/tenantInfo";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "BRIDGE_CONNECTOR_SETTING";
export const GET_CONNECTOR_LIST = `${PRE_FIX}GET_CONNECTOR_LIST`;
export const CREATE_CONNECTOR = `${PRE_FIX}CREATE_CONNECTOR`;
export const START_CONNECTOR = `${PRE_FIX}START_CONNECTOR`;
export const STOP_CONNECTOR = `${PRE_FIX}STOP_CONNECTOR`;
export const REMOVE_CONNECTOR = `${PRE_FIX}REMOVE_CONNECTOR`;
export const UPDATE_CONNECTOR = `${PRE_FIX}UPDATE_CONNECTOR`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getConnectorList = createAction(GET_CONNECTOR_LIST, () =>
  get({
    url: `/api/gwfacade/v1/sc/connectors?tenantId=${getTenantId()}`
  })
);

export const createConnector = createAction(CREATE_CONNECTOR, connector =>
  post({
    url: "/api/gwfacade/v1/sc/connector",
    data: {
      tenantId: getTenantId(),
      ...connector
    }
  })
);

export const startConnector = createAction(START_CONNECTOR, id =>
  put({
    url: "/api/gwfacade/v1/sc/connector/start",
    data: {
      tenantId: getTenantId(),
      id
    }
  })
);

export const stopConnector = createAction(STOP_CONNECTOR, id =>
  put({
    url: "/api/gwfacade/v1/sc/connector/stop",
    data: {
      tenantId: getTenantId(),
      id
    }
  })
);

export const removeConnector = createAction(REMOVE_CONNECTOR, id =>
  fetchDelete({
    url: "/api/gwfacade/v1/sc/connector",
    data: {
      tenantId: getTenantId(),
      id
    }
  })
);

export const updateConnector = createAction(UPDATE_CONNECTOR, connector =>
  put({
    url: "/api/gwfacade/v1/sc/connector",
    data: {
      tenantId: getTenantId(),
      ...connector
    }
  })
);
