import api from "@/api";
import { createAction } from "redux-actions";

export const APPLYING_GET_FIELDS_AND_INFO = "APPLYING_GET_FIELDS_AND_INFO";
import _ from "lodash";
//  获取表单数据
export const getFieldsAndInfo = createAction(
  APPLYING_GET_FIELDS_AND_INFO,
  async (vendor, flag) => {
    let getInfo;
    if (flag == "live") {
      getInfo = api.get(`/v1/account/apply/live/submitted?vendor=${vendor}`);
    } else if (flag == "same") {
      getInfo = api.get(`/v1/account/apply/homonym/info?vendor=${vendor}`);
    }
    let info = await getInfo;
    if (!info.result) {
      return info;
    }
    // 扁平化 info 数据
    const infoData = info.data || {};
    let resetInfoData = {};
    for (let key in infoData) {
      if (!_.isObject(infoData[key])) {
        resetInfoData[key] = infoData[key];
      } else {
        resetInfoData = { ...resetInfoData, ...infoData[key] };
      }
    }
    //  聚合表单数据
    // 先获取账户类型 再获取字段列表
    const getFileds = accountType =>
      api.get(
        `/v2/os/products/conf/${vendor}/form-fields?includeRelatedField=true${
          accountType ? `&accountType=${accountType}` : ""
        }`
      );
    const fields = await getFileds(resetInfoData.customAccountType);
    if (!fields.result) {
      return fields;
    }

    // 处理步骤
    let fieldsMap = {};
    const accountStepSettings = _.get(fields.data, "accountStepSettings", []);
    accountStepSettings.forEach(el => {
      fieldsMap[el.index] = el.fieldList;
    });
    for (let step in fieldsMap) {
      fieldsMap[step].forEach(el => {
        el.defaultValue = resetInfoData[el.key];
      });
    }
    fields.data = accountStepSettings;
    return Promise.resolve(fields);
  }
);
