import i18n from 'utils/i18n';
import {
  isRequired,
  isEmail,
  isPhone,
  isNumber,
  isMoney,
  isCountry,
  isPhoneRequired,
  isTinRequired
} from 'utils/validate';
import { FormattedMessage, defineMessages, IntlProvider } from 'react-intl';
import { isArrayField } from './utils';

const intlProvider = new IntlProvider({ locale: 'en' }, {});
const { intl } = intlProvider.getChildContext();

export default (values = {}, props) => {
  const { fields, disabled, validateFields } = props;
  const _field = validateFields || fields;
  const errors = {};
  if (!Array.isArray(_field)) {
    throw new Error(
      'fields or validateFields must be an Array as a props in custome field component!'
    );
  }
  _field.forEach(item => {
    const { key, validateType, label, errorCode, readonly, fieldType } = item;
    // 禁用的字段 不做验证
    if (readonly || disabled) return;
    // 如果字段中有errorCode, 则使用error code 代表的文字做为提示信息
    const errorMsg = errorCode ? i18n.mcode(errorCode) : false;
    if (values[key] && isArrayField(item)) {
      if (!Array.isArray(values[key])) {
        throw new Error('mutiple fields must have a array value');
      } else {
        const subErrors = [];
        values[key].forEach((value, i) => {
          subErrors[i] = validate(validateType, value, label, fieldType, item);
        });
        if (subErrors.filter(item => item).length) {
          errors[key] = subErrors;
        }
      }
    } else {
      errors[key] = validate(validateType, values[key], label, fieldType, item);
    }
    if (errorMsg && errors[key]) {
      errors[key] = intl.formatMessage(
        { id: 'custom_field.error_message_from_api', defaultMessage: errorMsg },
        { value: label }
      );
    }
  });
  return errors;
};

const validate = (validateType, value, label, fieldType) => {
  // 是否有必填规则
  if (validateType.required) {
    if (
      (fieldType === 'city' && !isCountry(value)) ||
      (fieldType === 'phone' && !isPhoneRequired(value)) ||
      (fieldType === 'tin' && !isTinRequired(value)) ||
      !isRequired(value)
    ) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.required'],
          id: 'custom_field.required'
        }),
        {
          value: label
        }
      );
    }
    // 是否有邮箱规则
  }
  if (validateType.email) {
    if (value && !isEmail(value)) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.email'],
          id: 'custom_field.email'
        }),
        { value: label }
      );
    }
    // 是否有数字规则
  }
  if (validateType.number) {
    if (value && !isNumber(value)) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.number'],
          id: 'custom_field.number'
        }),
        { value: label }
      );
    }
    // 是否有电话规则
  }
  if (validateType.phone) {
    if (value && value.phone && !isPhone(value.phone)) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.phone'],
          id: 'custom_field.phone'
        }),
        { value: label }
      );
    }
    // 是否有money规则
  }
  if (validateType.money) {
    if (value && !isMoney(value)) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.money'],
          id: 'custom_field.money'
        }),
        { value: label }
      );
    }
    // 是否有正则规则
  }
  if (validateType.regular) {
    const reg = eval(validateType.regular);
    if (value && !reg.test(value)) {
      return intl.formatMessage(
        defineMessages({
          defaultMessage: i18n['custom_field.regular'],
          id: 'custom_field.regular'
        }),
        { value: label }
      );
    }
  }
  if (fieldType === 'tin') {
    // if (Array.isArray(value)) {
    //   const errors = {};

    // value.forEach((item, idx) => {
    if (value) {
      if (value.countryCode && !value.tin) {
        return i18n['general.validate.tin.tin_error'];
      } else if (!value.countryCode && value.tin) {
        return i18n['general.validate.tin.country_code_error'];
      }
    }
    // });
    // if (Object.keys(errors).length) {
    //   return errors;
    // }
  }
  // }
  return false;
};
