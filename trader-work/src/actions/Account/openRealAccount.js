import api from "@/api";
import { createAction } from "redux-actions";
import _ from "lodash";

export const OPENREAL_FIELDS_INFO = "OPENREAL_FIELDS_INFO";
export const OPENREAL_STEP_SUBMIT = "OPENREAL_STEP_SUBMIT";

// 获取开户平台字段设置
export const getFieldsInfo = createAction(
  OPENREAL_FIELDS_INFO,
  (vendor, accountType) =>
    Promise.all([
      api.get(
        `/v2/os/products/conf/${vendor}/form-fields?includeRelatedField=true${
          accountType ? `&accountType=${accountType}` : ""
        }`
      ),
      api.get(`/v2/account/apply/live?vendor=${vendor}`),
      api.get(`/v2/account/apply/customer/info`),
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
      const res1 = res[0];
      const res2 = res[1];
      const res3 = res[2];
      const openDescData = res[3];
      const riskDescData = res[4];
      if (
        res1.result &&
        res2.result &&
        openDescData.result &&
        riskDescData.result
      ) {
        // const baseInfo = (res2.data && res2.data.step1 && Object.keys(res2.data.step1).length > 0) ? res2.data.step1 : res3.data.baseInfo || {}
        // const financialInfo = (res2.data && res2.data.step2 && Object.keys(res2.data.step2).length > 0) ? res2.data.step2 : res3.data.financialInfo || {}
        // const certificatesInfo = (res2.data && res2.data.step3 && Object.keys(res2.data.step3).length > 0) ? res2.data.step3 : res3.data.certificatesInfo || {}
        // res1.data.firstStepFieldList && res1.data.firstStepFieldList.forEach(f => {
        // 	if(baseInfo[f.key])
        // 	f.defaultValue = baseInfo[f.key]
        // })
        // res1.data.secondStepFieldList && res1.data.secondStepFieldList.forEach(f => {
        // 	if(financialInfo[f.key])
        // 	f.defaultValue = financialInfo[f.key]
        // })
        // res1.data.thirdStepFieldList && res1.data.thirdStepFieldList.forEach(f => {
        // 	if(certificatesInfo[f.key])
        // 	f.defaultValue = certificatesInfo[f.key]
        // })
        // res1.data.data = [baseInfo,financialInfo,certificatesInfo]

        // res3的data未分步骤？？？？？
        let stepMap = {};
        res2.data &&
          res2.data.forEach(el => {
            stepMap[el.index] = el.stepData;
          });
        let fieldsMap = {};
        const accountStepSettings = _.get(res1.data, "accountStepSettings", []);
        accountStepSettings.forEach(el => {
          fieldsMap[el.index] = el.fieldList;
        });
        for (let step in fieldsMap) {
          fieldsMap[step].forEach(el => {
            el.defaultValue = res3.data[el.key];
            for (let s in stepMap) {
              if (stepMap[s][`${el.formName}@${el.key}`]) {
                el.defaultValue = stepMap[s][`${el.formName}@${el.key}`];
              }
            }
          });
        }
        res1.data = {
          fields: accountStepSettings,
          data: stepMap,
          openDesc: openDescData.data,
          riskDesc: riskDescData.data
        };
        return Promise.resolve(res1);
      } else {
        if (!res1.result) {
          return Promise.resolve(res1);
        } else if (!res2.result) {
          return Promise.resolve(res2);
        } else if (!openDescData.result) {
          return Promise.resolve(openDescData);
        } else {
          return Promise.resolve(riskDescData);
        }
      }
    })
);
export const stepSubmit = createAction(
  OPENREAL_STEP_SUBMIT,
  (vendor, step, accountType, data) =>
    api
      .post(
        `/v2/account/apply/live/${vendor}/steps/${step}${
          accountType ? `?accountType=${accountType}` : ""
        }`,
        data
      )
      .then(res => {
        return Promise.resolve({ ...res, data: { data, step } });
      })
);
export const formSubmit = createAction(
  OPENREAL_STEP_SUBMIT,
  (vendor, customAccountType) =>
    api.post(
      `/v2/account/apply/live/${vendor}/submit${
        customAccountType ? `?customAccountType=${customAccountType}` : ""
      }`
    )
);
