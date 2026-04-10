import i18n from 'utils/i18n';
// 输出段落翻译时使用
// 'dashboard.vas.live.recommend.p1': '主要用于券商面向潜在客户、已有客户的一个培训、交流工具，可以在线进行相关直播，且可实时进行互动解答。',
// 'dashboard.vas.live.recommend.p2': '直播的消费规则主要以流量为准，在此可以提供两种流量包，分别是每月的基础包，和当基础流量用完之后的增值包。',
// 'dashboard.vas.live.recommend.p3': '如您要使用直播服务，需要联系客户经理开通部署。',
/**
 * s 为 <dashboard.vas.live.recommend.p>
 * r 为 <render函数>
 * 示例:
 * renderParagraph('dashboard.vas.live.recommend.p', (item ,i) => {
 *   return <div key={i}>{item}</div>;
 * })
 */

export default (s, r) => {
  const arr = [];
  let n = 1;
  while (true) {
    const txt = i18n[`${s}${n++}`];
    if (!txt) break;
    arr.push(txt);
  }
  return arr.map(r);
};
