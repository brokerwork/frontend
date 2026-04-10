import { Api_upLoadFile } from "src/api";
import { Api_downLoadFile } from "../api";
export function mutipleExportAndImportStore() {
  return {
    languageList: [],
    uploadFile(data) {
      return Api_upLoadFile(data);
    },
    downLoadFile(data) {
      return Api_downLoadFile(data);
    }
  };
}
