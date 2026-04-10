import { get, post } from "src/ajax";

// 查询语言
export const Api_GetLangList = data => {
  return get("/v1/i18/lang/list", data);
};
// 查询语言
export const Api_RemoveLang = id => {
  return post(`/v1/i18/lang/${id}/remove`);
};
