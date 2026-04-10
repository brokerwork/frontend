export default () => {
  const isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  // if (true || !isMac) {
  //   //暂时mac也修改滚动轴样式
  //   let scrollStyle = document.getElementById('lean-scroll-style');
  //   if (!scrollStyle) {
  //     scrollStyle = document.createElement('style');
  //     scrollStyle.setAttribute('id', 'lean-scroll-style');
  //     document.querySelector('head').appendChild(scrollStyle);
  //   }
  //   scrollStyle.innerHTML = `
  //     ::-webkit-scrollbar
  //     {
  //         width: 6px;
  //         height: 8px;
  //         background-color: #F5F5F5;
  //     }
      
  //     ::-webkit-scrollbar:vertical {
  //       width: 0;
  //     }
      
  //     /*定义滚动条轨道 内阴影+圆角*/
  //     ::-webkit-scrollbar-track
  //     {
  //         // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  //         border-radius: 16px;
  //         background-color: #fff;
  //     }
      
  //     /*定义滑块 内阴影+圆角*/
  //     ::-webkit-scrollbar-thumb
  //     {
  //         border-radius: 12px;
  //         // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  //         background-color: rgba(0,0,0, .1);
  //     }
  //   `;
  // }
};
