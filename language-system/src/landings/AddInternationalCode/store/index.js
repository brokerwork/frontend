import { Api_upsertLang } from "../api";
export function addCodeStore() {
  return {
    activeKey: "BW",
    handleActive(key) {
      this.activeKey = key;
    },
    upsertLang(data) {
      return Api_upsertLang(data);
    }
  };
}
