import { handleActions } from "redux-actions";
import { MENU } from "../constant";
import { getTenantId } from "utils/tenantInfo";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_MENU } from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const menus = handleActions(
  {
    [GET_MENU]: (state, { payload }) => {
      let copyData = JSON.parse(JSON.stringify(state));
      const categories = Object.keys(payload);
      const tenantId = getTenantId();
      const enableProdConsumptionId = [
        "T001160",
        "T000004",
        "T001152",
        "T001413"
      ];
      const enableQaConsumptionId = ["T001229", "T001312"];

      copyData = copyData
        .filter(item => categories.includes(item.category) || item.default)
        .map(item => {
          if (item.default) {
            return item;
          }

          return {
            ...item,
            subMenu: item.subMenu.filter(
              sub => payload[item.category].includes(sub.key) || sub.default
            )
          };
        });

      // if ((__QA__ && !enableQaConsumptionId.includes(tenantId)) || (__PROD__ && !enableProdConsumptionId.includes(tenantId))) {
      //   copyData = copyData.filter(item => item.category !== 'consumption');
      // }

      return copyData;
    }
  },
  MENU
);
