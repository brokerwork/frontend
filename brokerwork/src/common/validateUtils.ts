var ValidationUtils = {
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isEmptyString(str){
        return str.length == 0;
    },
    isNull(o){
      return o == null || o == undefined;
    },
    isEmail(str){
        var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return regex.test(str)
    },
    isPhoneNumber(str){
        return /^\d{8,11}$/.test(str)
    }
}

export {ValidationUtils}