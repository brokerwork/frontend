import { observable, action, flow } from "mobx";
import { searchRent } from "./api";
class AccountListStore {
  @observable rentId = "";
  @observable accountInfo = [];
  @action onChange = value => {
    this.rentId = value;
  };
  @action.bound
  getInfo = flow(function*(params) {
    const data = yield searchRent(params);
    this.accountInfo = data.list;
  });
  // @action
  // getInfo = async params => {
  //   const data = await searchRent(params);
  //   this.accountInfo = data.list;
  // };
}

export default new AccountListStore();
