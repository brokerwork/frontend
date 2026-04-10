import { get, post } from "src/ajax";
// 获取语言列表
export const Api_GetLanguageList = () => {
  return get("/v1/i18/multilingual/list");
};
// 上传文件
export const Api_upLoadFile = data => {
  return post("/v1/i18/upload", data);
};
