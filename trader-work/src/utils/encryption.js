import {JSEncrypt as RSA} from 'jsencrypt';
import CryptoJS from 'crypto-js';
export const AES_KEY = 'AES_KEY';

// 最大可以设置为117
// 设置为86是因为加密后密文长度为172, 在二次加密时平均分配字符长度
const MAX_ENCRYPT_SIZE = 200;
const RSAObject = new RSA({default_key_size: 2048});

// AES 配置
const AESOption = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7,
};

const readKeyFromStorage = () => {
  let tmpKey = window.localStorage.getItem(AES_KEY);
  tmpKey = CryptoJS.enc.Utf8.parse(tmpKey);
  if (!tmpKey) return false;
  AESOption.key = tmpKey;
  return tmpKey;
};

// AES 解密
export const AESDecrypt = (encrypted) => {
  let {key, ...option} = AESOption;
  key = key || readKeyFromStorage();
  if (!key) return false;
  const d = CryptoJS.AES.decrypt(encrypted, key, option);
  const dString = d.toString(CryptoJS.enc.Utf8);
  return JSON.parse(dString);
};

// AES 加密
export const AESEncrypt = (json) => {
  let {key, ...option} = AESOption;
  key = key || readKeyFromStorage();
  if (!key) return false;
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(json), key, option);
  return encrypted.toString();
};

function stringArrayEncryptFunc (strArr) {
  return strArr.map(item => RSAObject.encrypt(item));
}

function stringSplitFunc (str) {
  if (str.length < MAX_ENCRYPT_SIZE) return [str];
  const strArr = [];
  let len = 0;
  while (true) {
    const endSize = MAX_ENCRYPT_SIZE + len;
    const s = str.substring(len, endSize);
    if (s.length === 0) break;
    strArr.push(s);
    len = endSize;
  }
  return strArr;
}


// 设置RSA公钥
export const setRSAPublicKey = (key) => {
  RSAObject.setPublicKey(key);
};

// 生成AES key
export const createAESKey = () => {
  const stringMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const stringMapSize = stringMap.length;
  const strArr = [];
  for (let i = 0, l = 16; i < l; i++) {
    const r = Math.floor(Math.random() * stringMapSize);
    strArr.push(stringMap.charAt(r));
  }
  const key = strArr.join('');
  window.localStorage.setItem(AES_KEY, key);
  AESOption.key = CryptoJS.enc.Utf8.parse(key);
  return key;
};

// RSA 解密
export const RSADecrypt = (encrypted) => {
  return encrypted;
  // const rsa = new RSA({default_key_size: 2048});
  // // rsa.setPrivateKey('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDGr4SRxZX6AH8HzV2or5YkzX/SqAJLS4Wh0u/+7KC01Mp/iZsfB/L/3RI8guSmqQ7fUXcHkxjIuSX0xAW4D0MP3l9wU5AUvvARScC2cZvNFtUKqjYlxSnJZXv0sN4WWwvzs0y/C0gZ/mB4QMss9PtZLrdfqjcsBpauujdn+vN/rPApJafOgyGNytXqKeY6Qsak4xDHA6C15ouZi8nzHcFrKiRMZEM4fYkwzDj0L1zlLabAn5rGQB2LR6LzdjkrlZwIRvF41rFmINmz0c3jbz9Am061xc+2nQ/JQffjj3JzAGNgX4cePGKG+z8/Mj9qA9ZW0TiEZtrUt3JrkkwaHsopAgMBAAECggEAW5YY5CFSixWjePM/0zxtV7Wq0G5F8HN1vCzCGJ73TaQxXC0QZnOBnlRHzcEAqZqQkny5A7LY394JExUxFbFjVnNJRzwd1JJXk4CN5wvjp9x4hBwGLc7+/ilbxGWrWl7J2aKzI/WNXP4XdhdYEPc0zd1tBhouqIq49v48ACB8EkPS4h6p0uj9Ne/xvrnsBmpK83I7eHO3phC7W5jfQMjtmnQPDbspYBNXszUFvi8+cfezONSYEKWVhNK7bsB7hMyOdIibqPvHHcD844lU7H8GptTPKl1Ms27K4rMCeJS5NmiZaYPaIR2q/0NfDmbPBVKLbove7RM8i/ShCGl1BSquoQKBgQD4flCtxSLXpEQGUmCHS9OgFNbbG45tIqBO7imEcuqNLTUkEbszUWwkWzH6ejpXeWRYHvEhedOeCH9wk0X5nwhm/6FuhuoCPtVsZVyFRniKmWTcgql1GqXmM2PHzlC3IsjAa/MLvLzkDoIorBagtXuV9U7ior91u/BOhOZm+JRxFQKBgQDMsAWZ4IqbX6CtIcNqa1amLv5FRel/fMOfl6MxMy/G+7ocVKx+QfiZzyxPonAGTxvrMWcDahpQ0MqrRTmRPp+4geI8EmKBjOFYA+s4mUT6mVHijh4kMynEPZHPYYjy6QW54m5iFhBmExHfOWuI6K9cdFx6YScM+U/4YvsqcXPxxQKBgQCy/wpOofp/Kyx1AVHXI5/FaD18h1UI+DBRquztI3ohR7dHzB300Wn8plRSAUmVSTQm5eL8Ii11YNmr1epJ7Wy4BNvcKgLWqzxBYKJMvn6GGAi3bsdyO0fVkp8FhnBN+xhww1HH2qSWAn1vnsaN7Syg0JuKVYFk5YQsiz8MXXNQIQKBgQCe33E5gqOS/aKFP1OiYjYbPxZ1RlJ6daiRUu2D3qsS04gdPUu1pBcFq1xFY1t4SibtYqcGa3CJkcX9MfoA1o66c3XaEpsK2wJ9gm0svSphKGf6ZTzX9C5S90cZpCbcBCpBoZLz5xRLZjnU/YiN961FIbw18PqSg2Ci9pDk3LKV0QKBgEsP6cWcsDlYPofmoHhQamHnohcke9KbuXArqosJ7GMKDIAZcz/2bFitgUScE18rJ4XvSYSqcTSle15ilVHc4Sk5eUKcdhQCtIWVXU6zkSlTZyCL/B8XFKFFwxfBTh6Wa7+os9x0u70bNxEve8vSuHLIRiHYbNidsEOXwxanrZ6s');
  // const encrytionStrArr = [];
  // let len = 0;
  // while (true) {
  //   const endSize = 344 + len;
  //   const s = encrypted.substring(len, endSize);
  //   if (s.length === 0) break;
  //   encrytionStrArr.push(s);
  //   len = endSize;
  // }
  // const strArr = encrytionStrArr.map(item => {
  //   return RSAObject.decrypt(item);
  // });
  // return JSON.parse(strArr.join(''));
};

// RSA 加密
export const RSAEncrypt = (json) => {
  const jsonStringify = JSON.stringify(json);
  const stringSplit = stringSplitFunc(jsonStringify);
  return stringArrayEncryptFunc(stringSplit).join('');
};

