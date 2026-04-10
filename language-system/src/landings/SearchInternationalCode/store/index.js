import { Api_GetLangList, Api_RemoveLang } from "../api";
import { Api_upsertLang } from "landings/AddInternationalCode/api";
import _ from "lodash";
export function searchCodeStore() {
  return {
    langList: [],
    searchParams: {
      searchResKey: "",
      searchContent: ""
    },
    async getLangList() {
      const params = _.cloneDeep(this.searchParams);
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key];
        }
      });
      const { result, data } = await Api_GetLangList(params);
      if (result) {
        this.langList = data;
      }
    },
    upsertLang(data) {
      return Api_upsertLang(data);
    },
    removeLang(id) {
      return Api_RemoveLang(id);
    },
    changeCondition(key, value) {
      this.searchParams[key] = value;
    }
  };
}
