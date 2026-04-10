import cookie from 'js-cookie';
const TENANT_INFO_KEY = 'TENANT_INFO';
const TENANT_ID_KEY = 'TENANT_ID';

export const saveTenantInfo = function(v) {
  const tenantInfo = JSON.stringify(v);
  window.sessionStorage.setItem(TENANT_INFO_KEY, tenantInfo);
  // 
  window.localStorage.setItem(TENANT_INFO_KEY, tenantInfo);
};

export const getTenantInfo = function() {
  const tenantInfo = window.sessionStorage.getItem(TENANT_INFO_KEY);
  return JSON.parse(tenantInfo);
};

export const clearTenantInfo = function() {
  window.sessionStorage.removeItem(TENANT_INFO_KEY);
};

export const getTenantId = () => {
  const s =  window.sessionStorage.getItem(TENANT_ID_KEY);
  if (s) return s;
  const c = cookie.get(TENANT_ID_KEY);
  if (c) window.sessionStorage.setItem(TENANT_ID_KEY, c);
  return c;
};

export const saveTenantId = (v) => {
  cookie.set(TENANT_ID_KEY, v);
  window.sessionStorage.setItem(TENANT_ID_KEY, v);
};

export const removeTenantId = () => {
  window.sessionStorage.removeItem(TENANT_ID_KEY);
  cookie.remove(TENANT_ID_KEY);
};