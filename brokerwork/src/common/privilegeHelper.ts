import { HttpClient } from '../http/httpclient';
import { Message } from 'fooui';
//前端权限控制方案：获取当前用户的所有权限列表，页面加载进来就获取该用户的所有权限。
//对每一个需要权限控制的地方做包装，传这个组件控制依赖的权限进getOperationPrivilege判断该用户是否有权限。没有权限=false.即隐藏。有权限=true，显示.
//Helper 做调用函数getOperationPrivilege的作用。privilegeInterceptor缓存sessionstorage当前用户权限列表。
//以上两项共同构成一个权限服务。
let PrivilegeHelper = {
  USER_RIGHT: 'USER_RIGHT',
  __RIGHTS__: null,
  saveRight: function (rights) {
    const __obj = {};
    rights.forEach((item) => {
      __obj[item] = true;
    });
    this.__RIGHTS__ = __obj;
    sessionStorage.setItem( this.USER_RIGHT, JSON.stringify(__obj));
    // 权限更新到sesstionStorage后强制刷新一次.
    // 临时解决方案
    setTimeout(function() {
      window.location.reload(true);
    }, 100);
  },
  getHavePrivilege (privilege:string) {
    if (!this.__RIGHTS__) {
      var r = sessionStorage.getItem(this.USER_RIGHT);
      if (r) this.__RIGHTS__ = JSON.parse(r);
    }
    return this.__RIGHTS__ ? this.__RIGHTS__[privilege]: false;
  }
}

export default PrivilegeHelper;