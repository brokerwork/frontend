import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  LOGIN_CONFIG_ACCESS,
  LOGIN_UPDATE_CONFIG_ACCESS,
  FETCHPLATFORMS
} from "@/actions/Login/login";

//  登录注册页SC配置
const configAcessResult = handleActions(
  {
    [LOGIN_CONFIG_ACCESS]: (state, { payload }) => payload,
    [LOGIN_UPDATE_CONFIG_ACCESS]: (state, { type, payload }) => {
      return Object.assign({}, state, {
        defaultRegisterMethod: payload
      });
    }
  },
  {}
);
const platforms = handleActions(
  {
    [FETCHPLATFORMS]: (state, { type, payload }) => payload
  },
  []
);
// const validateSettingData = handleActions(
//   {
//     [GET_FA_DATA]: (state, { type, payload }) => payload
//   },
//   []
// );

export default combineReducers({
  configAcessResult,
  platforms
});
