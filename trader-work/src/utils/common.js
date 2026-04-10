// 反转译
const unescapeHTML = str =>
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    tag =>
      ({
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&#39;": "'",
        "&quot;": '"'
      }[tag] || tag)
  );
const utils = {
  parseUrlParams() {
    // 某些浏览器比如(qq)，会将& 转译为 &amp; 因此此处作此处理
    let search = unescapeHTML(location.search);
    if (search && search.startsWith("?")) {
      search = search.substr(1);
      let paramsArray = search.split("&");
      let result = {};
      paramsArray.forEach(params => {
        let pair = params.split("=");
        let key = decodeURIComponent(pair[0]);
        if (key === "ticket") {
          // 由于为了和bw兼容，后台存的ticket是经过urlencode的，所以前端无需decode后再传回去
          result[key] = pair[1];
        } else {
          result[key] = decodeURIComponent(pair[1]);
        }
      });
      return result;
    }
    return {};
  },
  isFullUrl(url) {
    return !url || url.indexOf("http") == 0 || url.indexOf("//") == 0;
  },
  selectText(dom) {
    // 只有带有value属性的才能被选中
    let end = dom.value.length;
    dom.setSelectionRange(0, end);
  }
};

export default utils;
