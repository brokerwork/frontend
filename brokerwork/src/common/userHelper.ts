import * as cookie from 'js-cookie';
interface UserInfoInterface {
  address: string,
  birthday: string,
  city: string,
  comment: string,
  country: string,
  createDate: number,
  email: string,
  entityNo: string,
  headImage: string,
  id: number,
  modifyDate: number,
  name: string,
  nickname: string,
  parent: string,
  parentName: string,
  password: string,
  phone: string,
  postcode: string,
  province: string,
  pubUserId: string,
  roleId: string,
  levelId:string,
  tenantId: string,
  username: string,
  login: string,
  vendorServerId: string
}

let UserHelper = {
  SESSION_KEY_USER_INFO: 'USER_INFO',
  SESSION_KEY_TOKEN: 'TOKEN',
  UI_PRIVILEGE: 'UI_PRIVILEGE',
  // UI_OPERATION_PRIVILEGE_LIST: 'UI_OPERATION_PRIVILEGE_LIST',
  
  getUserInfo():UserInfoInterface {
    let userInfo:UserInfoInterface;
    if ( window.sessionStorage ) {
      let userInfoJsonStr = window.sessionStorage.getItem( this.SESSION_KEY_USER_INFO );
      try {
        userInfo = JSON.parse( userInfoJsonStr );
      } catch (error) {
        
      }
    }
    return userInfo;
  },
  getToken() {
    let token:string = '111';
    if ( window.sessionStorage ) {
      try {
        token = window.sessionStorage.getItem( this.SESSION_KEY_TOKEN );
        if (!token) {
          token = cookie.get(this.SESSION_KEY_TOKEN)
        }
      } catch (error) {
        
      }
    }
    return token;
  }
}

export { UserHelper };
