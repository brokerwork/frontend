export const PDF_ACOUNT_KEY = 'ACCOUNT_PDF';

export const getAccountPdf = () => {
  const data = window.localStorage.getItem(PDF_ACOUNT_KEY);
  return JSON.parse(data);
};

export const saveAccountPdf = v => {
  const data = JSON.stringify(v);
  window.localStorage.setItem(PDF_ACOUNT_KEY, data);
};

export const clearAccountPdf = function() {
  window.sessionStorage.removeItem(PDF_ACOUNT_KEY);
};
