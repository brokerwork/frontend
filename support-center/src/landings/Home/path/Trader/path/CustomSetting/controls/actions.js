import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import language from 'utils/language';
import { getTenantId } from 'utils/tenantInfo';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_CUSTOM_SETTING_';

// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const SAVE_ACCOUNT = `${PRE_FIX}SAVE_ACCOUNT`;
// export const GET_MENU_LIST = `${PRE_FIX}GET_MENU_LIST`;

export const saveAccount = createAction(SAVE_ACCOUNT, (plat, type, data) =>
  post({
    url: `/v1/ops/product/conf/${plat}/${type}`,
    data
  })
);
