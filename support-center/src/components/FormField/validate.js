import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import { isLetters } from 'utils/validate';

/** 邮箱校验规则 */
export const EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
/* 手机号规则  */
export const PHONE = /^1\d{10}$/;
/* 密码：8-10位大小写字母和数字租户 */
export const PWD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
/* 座机：*/
export const MOB = /^\d[-0-9]+\d$/;
/* qq */
export const QQ = /^\d{5,12}$/;
/*链接*/
export const LINK = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

//无任何限制，用于切换验证方式后清空提示信息
export const free = value => {
  return undefined;
};

export const required = value => {
  const result = Array.isArray(value) ? value.length : !!value;
  return result
    ? undefined
    : (label, type) => {
        let requireText = '';
        switch (type) {
          case 'select':
            requireText = 'validate.required.select';
            break;
          case 'file':
            requireText = 'validate.required.upload';
            break;
          default:
            requireText = 'validate.required';
        }
        return <FormattedMessage id={requireText} defaultMessage={i18n[requireText]} values={{ value: label }} />;
      };
};

export const letters = value => {
  const result = isLetters(value);

  return result
    ? undefined
    : label => <FormattedMessage id="validate.required" defaultMessage={'请输入字母'} values={{ value: label }} />;
};

export const isEmail = value => (!!value ? (EMAIL.test(value) ? undefined : i18n['validate.email']) : undefined);

export const isPhone = value => (!!value ? (PHONE.test(value) ? undefined : i18n['validate.phone']) : undefined);

export const isPassword = value => (!!value ? (PWD.test(value) ? undefined : i18n['validate.password']) : undefined);

export const isMob = value => (!!value ? (MOB.test(value) ? undefined : i18n['validate.mob']) : undefined);

export const isQq = value => (!!value ? (QQ.test(value) ? undefined : i18n['validate.qq']) : undefined);

export const isLink = value => (!!value ? (LINK.test(value) ? undefined : i18n['validate.link']) : undefined);

export const maxLength = max => value =>
  value && value.length > max ? (
    <FormattedMessage id="validate.max_length" defaultMessage={i18n['validate.max_length']} values={{ max }} />
  ) : (
    undefined
  );

export const numberRequired = value =>
  typeof value === 'number'
    ? undefined
    : label => (
        <FormattedMessage id="validate.required" defaultMessage={i18n['validate.required']} values={{ value: label }} />
      );
