export default title => {
  let pageTitle = document.querySelector('head > title');
  if (!pageTitle) {
    pageTitle = document.createElement('title');
    document.querySelector('head').appendChild(pageTitle);
  }
  pageTitle.innerHTML = title;
};
