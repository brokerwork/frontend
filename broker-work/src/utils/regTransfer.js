import i18n from './i18n';
const PwdPlaceholder = {
  Middle: i18n['usermgmt.usercard.password_middle'],
  Strong: i18n['usermgmt.usercard.password_strong'],
  SuperStrong: i18n['usermgmt.usercard.password_super_Strong']
};

const PUNCT = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

export default (data, pwdStrength) => {
  let map = {};
  for (let key in data) {
    let backendRegExp = data[key];
    map[key] = {
      reg: new RegExp(
        backendRegExp
          .replace(/\\p{Digit}/g, '\\d')
          .replace(/\\p{Lower}/g, 'a-z')
          .replace(/\\p{Upper}/g, 'A-Z')
          .replace(/\\p{Alpha}/g, 'a-zA-Z')
          .replace(/\\p{Punct}/g, PUNCT)
      ),
      tips: PwdPlaceholder[key]
    };
  }
  if (pwdStrength) {
    return map[pwdStrength];
  }
  return map;
};
