import { Api_AddLanguage, Api_RemoveLanguage } from "../api";
import { Api_GetLanguageList } from "src/api";
export function mutipleLanguageStore() {
  return {
    languageList: [],
    addModalVisible: false,
    async getLanguageLists() {
      const { result, data } = await Api_GetLanguageList();
      if (result) {
        this.languageList = data;
      }
    },
    addLanguage(data) {
      return Api_AddLanguage(data);
    },
    removeLanguage(id) {
      return Api_RemoveLanguage(id);
    },
    isModalVisible(visible) {
      this.addModalVisible = visible;
    }
  };
}
