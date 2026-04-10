import { observable, flow, action } from "mobx";
import Ajax from "@/ajax";
import ls, { TOKEN } from "@/utils/storage";
import { Toast } from "antd-mobile";
import { history } from "../index";

class CommonStore {
  @observable userRights = [];
  fetchUserRights = flow(function*() {
    const rs = yield Ajax.get("/v1/os/user/permission");
    if (rs && rs.data) this.userRights = rs.data;
  });
  @action.bound
  logout = async token => {
    const res = await Ajax.post("/v1/pub/auth/logout?token=" + token);
    if (res && res.result) {
      ls.remove(TOKEN);
      Toast.info("退出登陆成功");
      setTimeout(() => {
        history.push("/login");
      }, 1000);
    }
  };
}

export default new CommonStore();
