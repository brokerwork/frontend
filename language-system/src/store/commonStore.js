import { observable, flow } from "mobx";
import { Api_GetLanguageList } from "../api";
export class CommonStore {
  @observable
  languageList = [];
  getLanguageList = flow(function*() {
    const { result, data } = yield Api_GetLanguageList(); // yield instead of await
    if (result) {
      this.languageList = data;
    }
    // the asynchronous blocks will automatically be wrapped in actions and can modify state
  });
}
