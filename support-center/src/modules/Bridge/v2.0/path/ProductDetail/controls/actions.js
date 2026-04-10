import { createAction } from "redux-actions";
import { get, post, put } from "utils/ajax";
import { getTenantId } from "utils/tenantInfo";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "BRIDGE_PRODUCT_DETAIL";
export const GET_PRODUCT_INFO = `${PRE_FIX}GET_PRODUCT_INFO`;
export const REFRESH_API_TOKEN = `${PRE_FIX}REFRESH_API_TOKEN`;
export const GET_USAGE_INFO = `${PRE_FIX}GET_USAGE_INFO`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getProductInfo = createAction(GET_PRODUCT_INFO, () =>
  get({
    url: `/api/gwfacade/v1/sc/productInfo?tenantId=${getTenantId()}`
  })
);

export const refreshApiToken = createAction(REFRESH_API_TOKEN, () =>
  put({
    url: "/api/gwfacade/v1/sc/refreshApiToken",
    data: {
      tenantId: getTenantId()
    }
  })
);

export const getUsageInfo = createAction(GET_USAGE_INFO, () =>
  get({
    url: `/api/gwfacade/v1/sc/usage?tenantId=${getTenantId()}`
  })
);
