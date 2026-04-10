import { get } from "src/ajax";

// 上传文件
export const Api_downLoadFile = data => {
  return get("/v1/i18/download", data);
};
