import URLSearchParams from 'url-search-params';
// 反转译
const unescapeHTML = str =>
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    tag =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"'
      }[tag] || tag)
  );
export default (searchString = '') => {
  // 某些浏览器比如(qq)，会将& 转译为 &amp; 因此此处作此处理
  let str = unescapeHTML(searchString);
  if (str.charAt(0) === '?') {
    str = str.substring(1);
  }
  return new URLSearchParams(str);
};
