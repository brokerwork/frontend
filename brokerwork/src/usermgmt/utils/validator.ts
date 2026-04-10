export let Validator ={
  validateEmailFormat( email:string = '' ) {
    return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(email);
  },
  validatePwdFormat( pwd:string = '' ) {
    let len = pwd.length;
    return len <=20 && len>=6 && /\w+/.test(pwd) && /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/.test(pwd)
  }
}