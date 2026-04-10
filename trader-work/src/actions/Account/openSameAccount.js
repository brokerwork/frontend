import api from "@/api";
import { createAction } from "redux-actions";
import _ from "lodash";

export const SAME_SAVE_FIELD_INFO = "SAME_SAVE_FIELD_INFO";
export const SAME_FIELDS_SAME_INFO = "SAME_FIELDS_SAME_INFO";
export const SAME_SUBMIT_SAME_INFO = "SAME_APPLY_SAME_INFO";
export const GET_SAME_ACCOUNT_CONFIG = "GET_SAME_ACCOUNT_CONFIG";

//  获取并聚合表单数据
export const getFieldsAndSameInfo = createAction(
  SAME_FIELDS_SAME_INFO,
  (vendor, accountType) => {
    return Promise.all([
      // api.get(`/v1/common/account/info/${vendor}/fields`),
      api.get(`/v1/account/origin/info`),
      api.get(
        `/v1/account/apply/sameinfo/isSufficient?vendor=${vendor}${
          accountType ? `&accountType=${accountType}` : ""
        }`
      ),
      api.get(
        `/v2/os/products/conf/${vendor}/form-fields?includeRelatedField=true${
          accountType ? `&accountType=${accountType}` : ""
        }`
      ),
      api.get(
        `/v2/os/products/conf/${vendor}/open-desc${
          accountType ? `?accountType=${accountType}` : ""
        }`
      ),
      api.get(
        `/v2/os/products/conf/${vendor}/risk-desc${
          accountType ? `?accountType=${accountType}` : ""
        }`
      )
    ]).then(res => {
      let info = res[0];
      let isSufficient = res[1];
      let formFields = res[2];
      let openDesc = res[3];
      let riskDesc = res[4];
      //   if (res1.result && res2.result) {
      //     let fieldsData = res1.data;
      //     let stepData = res2.data;
      //     fieldsData.step = stepData;
      //     fieldsData.isSufficient = res[2] && res[2].data;
      //     fieldsData.firstStepFieldList &&
      //       stepData.baseInfo &&
      //       fieldsData.firstStepFieldList.forEach((item, index) => {
      //         const value = stepData.baseInfo[item.key];
      //         item.enable =
      //           item.validateType && item.validateType.required && !value;
      //         if (value) item.defaultValue = value;
      //       });
      //     fieldsData.secondStepFieldList &&
      //       stepData.financialInfo &&
      //       fieldsData.secondStepFieldList.forEach((item, index) => {
      //         const value = stepData.financialInfo[item.key];
      //         item.enable =
      //           item.validateType && item.validateType.required && !value;
      //         if (value) item.defaultValue = value;
      //       });
      //     fieldsData.thirdStepFieldList &&
      //       stepData.certificatesInfo &&
      //       fieldsData.thirdStepFieldList.forEach((item, index) => {
      //         const value = stepData.certificatesInfo[item.key];
      //         item.enable =
      //           item.validateType && item.validateType.required && !value;
      //         if (value) item.defaultValue = value;
      //       });
      //     return Promise.resolve(res1);
      //   }
      if (res.every(item => item.result)) {
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
        // 处理步骤
        let fieldsMap = {};
        const accountStepSettings = _.get(
          formFields.data,
          "accountStepSettings",
          []
        );
        accountStepSettings.forEach(el => {
          fieldsMap[el.index] = el.fieldList;
        });
        for (let step in fieldsMap) {
          fieldsMap[step].forEach(el => {
            el.defaultValue = resetInfoData[el.key];
            // 将自定义步骤中的字段添加到固定的三步中
            if (
              el.formName === "t_account_profiles" ||
              el.formName === "t_customer_profiles"
            ) {
              infoData.baseInfo[el.key] = "";
            } else if (el.formName === "t_account_finacial") {
              infoData.financialInfo[el.key] = "";
            } else if (el.formName === "t_account_id_info") {
              infoData.certificatesInfo[el.key] = "";
            }
          });
        }
        formFields.data = {
          isSufficient: isSufficient && isSufficient.data,
          accountStepSettings,
          step: infoData,
          resetInfoData,
          openDesc: openDesc.data,
          riskDesc: riskDesc.data
        };
        return Promise.resolve(formFields);
      } else {
        return Promise.resolve(res.find(item => !item.result));
      }
    });
  }
);
//  保存表单信息到store
export const saveFieldInfo = data => ({
  type: SAME_SAVE_FIELD_INFO,
  payload: data
});
//  确认提交
export const submitSameInfo = createAction(
  SAME_SUBMIT_SAME_INFO,
  (params, customAccountType) => {
    return api.post(
      `/v1/account/apply/sameinfo?customAccountType=${customAccountType ||
        null}`,
      params
    );
  }
);

// 获取同名账户账户说明配置
export const getSameAccountConfig = createAction(
  GET_SAME_ACCOUNT_CONFIG,
  structural => api.get(`/v2/os/products/conf/${structural}/samea-account`)
);
