import { get, post } from "src/ajax";
// 添加语言
export const Api_upsertLang = data => {
  return post("/v1/i18/lang/upsert", data);
};
