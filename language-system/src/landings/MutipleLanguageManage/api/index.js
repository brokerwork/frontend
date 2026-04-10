import { post } from "src/ajax";

// 新增语言
export const Api_AddLanguage = data => {
  return post("/v1/i18/multilingual/upsert", data);
};
// 删除语言
export const Api_RemoveLanguage = id => {
  return post(`/v1/i18/multilingual/${id}/remove`);
};
