import { createAction } from "redux-actions";

import api from "@/api";
const PREFIXED = "LOGIN_";
export const LOGIN_CONFIG_ACCESS = "LOGIN_CONFIG_ACCESS";
export const LOGIN_UPDATE_CONFIG_ACCESS = "LOGIN_UPDATE_CONFIG_ACCESS";
export const LOGIN_UPDATE_PSWD = "LOGIN_UPDATE_PSWD";
export const FETCHPLATFORMS = "FETCHPLATFORMS";
// export const GET_FA_DATA = `${PREFIXED}GET_FA_DATA`;

//  获取登录注册页SC配置
export const loginConfigAccess = createAction(LOGIN_CONFIG_ACCESS, () => {
  return api.get("/v1/config/access");
});
export const fetchPlatforms = createAction(FETCHPLATFORMS, data =>
  api.get("/v1/config/fastsignup")
);

export const updateConfigAccess = createAction(
  LOGIN_UPDATE_CONFIG_ACCESS,
  type => {
    return type;
  }
);

export const updatePswd = createAction(LOGIN_UPDATE_PSWD, pswdData => {
  return api.post("/v2/user/pwd/modify", {
    origin: pswdData.origin,
    newPwd: pswdData.newPwd,
    verified: pswdData.verified
  });
});

// export const getFaData = createAction(GET_FA_DATA, token =>
//   api.get("/v1/tw/user/2fa/setting", null, token)
// );
