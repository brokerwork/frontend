export default (url, containerDocument = document) => {
  const frame = containerDocument.createElement('iframe');
  frame.className = 'iframe-view-frame';
  frame.style.visibility = 'hidden';
  frame.style.position = 'fixed';
  frame.style.left = '-10000px';
  frame.style.top = '0px';
  frame.style.border = '0';
  frame.width = '100%';
  frame.height = '100%';
  frame.scrolling = 'no'; // ios won't scroll
  containerDocument.body.appendChild(frame);
  return new Promise(resolve => {
    const documentClone = frame.contentWindow.document;
    frame.contentWindow.onload = frame.onload = () => {
      const interval = setInterval(() => {
        clearInterval(interval);
        frame.contentWindow.__IS_FRAME__ = true;
        frame.contentWindow.IFRAME_DONE = function(...args) {
          containerDocument.body.removeChild(frame);
          resolve(frame, ...args);
        };
      });
    };
    frame.src = url;
  });
};
