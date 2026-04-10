import { ACCOUNT_NAME_FIELD_PREFIX, ACCOUNT_DESC_FIELD_PREFIX } from './PersonalAccountForm';

/**
 * 将初始化数据转换成表单接受的结构
 * @param values
 */
export function transInitValues(values) {
  const newValues = { ...values };

  const accountName = newValues.accountName || {};
  const accountDesc = newValues.accountDesc || {};

  Object.keys(accountName).forEach(k => {
    newValues[`${ACCOUNT_NAME_FIELD_PREFIX}${k}`] = accountName[k];
  });
  Object.keys(accountDesc).forEach(k => {
    newValues[`${ACCOUNT_DESC_FIELD_PREFIX}${k}`] = accountDesc[k];
  });

  delete newValues.accountName;
  delete newValues.accountDesc;

  return newValues;
}

/**
 * 将表单数据转换成服务器接受的结构
 * @param data
 */
export function transSubmitData(data) {
  const newData = {};

  //多语言数据处理
  const accountName = {};
  const accountDesc = {};

  Object.keys(data).forEach(k => {
    if (k.includes(ACCOUNT_NAME_FIELD_PREFIX)) {
      accountName[k.substring(ACCOUNT_NAME_FIELD_PREFIX.length)] = data[k];
    } else if (k.includes(ACCOUNT_DESC_FIELD_PREFIX)) {
      accountDesc[k.substring(ACCOUNT_DESC_FIELD_PREFIX.length)] = data[k];
    } else {
      //其他正常数据
      newData[k] = data[k];
    }
  });

  newData.accountName = accountName;
  newData.accountDesc = accountDesc;

  return newData;
}
