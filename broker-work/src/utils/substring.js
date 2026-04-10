/**
 * 截取字符串，超出限制显示...
 * @param str
 * @param maxLength
 * @return {*}
 */
export const substring = (str, maxLength) => {
  if (!str) {
    return '--';
  }
  if (!maxLength) {
    return str;
  }

  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};
