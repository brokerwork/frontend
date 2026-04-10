import api from "@/api";
import { createAction } from "redux-actions";

export const ACCOUNT_INFO_FIELDS = "ACCOUNT_INFO_FIELDS";
export const ACCOUNT_INFO_SUBMIT = "ACCOUNT_INFO_SUBMIT";
// 获取账户资料字段信息、值、允许编辑
export const getAccountInfo = createAction(ACCOUNT_INFO_FIELDS, () =>
  Promise.all([
    api.get("/v1/common/account/info/fields"),
    api.get("/v1/account/info"),
    api.get("/v1/account/info/editable"),
    api.get("/v1/ops/product/account/properties/setting")
  ]).then(([res1, res2, res3, config]) => {
    const setDefault = (fields, values, setting) => {
      // set default value for all fields
      fields.forEach(f => {
        f.enable = false;
        const value = values[f.key];
        if (value) {
          f.defaultValue = value;
        }
      });
    };
    if (res1.result && res2.result && config.result) {
      const base = res2.data.base || {};
      const finance = res2.data.finance || {};
      const cert = res2.data.cert || {};
      const setting = config.data || {};
      const conditionsMsg = getConditionsMessage(setting);
      setDefault(res1.data.t_account_profiles, base, setting);
      setDefault(res1.data.t_account_finacial, finance, setting);
      setDefault(res1.data.t_account_id_info, cert, setting);
      res1.data.data = { ...res2.data };
      res1.data.editable = res3 && res3.data;
      res1.data.setting = { ...setting, conditionsMsg };
      return Promise.resolve(res1);
    } else {
      if (!res1.result) {
        return Promise.resolve(res1);
      } else {
        return Promise.resolve(res2);
      }
    }
  })
);

const getConditionsMessage = ({ conditions = [] }) => {
  const map = {};
  conditions.forEach(({ fieldId, message }) => {
    map[fieldId] = { ...message };
  });
  return map;
};

export const submitAccountInfo = createAction(ACCOUNT_INFO_SUBMIT, data =>
  api.post("/v1/account/info", data)
);
