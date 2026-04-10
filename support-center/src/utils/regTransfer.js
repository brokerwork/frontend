const PwdPlaceholder = {
  "Middle": "数字、字母组成，不少于6位",
  "Strong": "数字、大小写字母组成，不少于8位",
  "SuperStrong": "数字、大小写字母、符号组成，不少于8位"
};

const PUNCT = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

export default (data, pwdStrength) => {
  let map = {};
  for (let key in data) {
    let backendRegExp = data[key];
    map[key] = {
      reg: new RegExp( backendRegExp.replace(/\\p{Digit}/g, '\\d').replace(/\\p{Lower}/g, 'a-z').replace(/\\p{Upper}/g, 'A-Z').replace(/\\p{Alpha}/g, 'a-zA-Z').replace(/\\p{Punct}/g, PUNCT)),
      tips: PwdPlaceholder[key],
    };
  };
  if (pwdStrength) {
    return map[pwdStrength];
  }
  return map;
}
