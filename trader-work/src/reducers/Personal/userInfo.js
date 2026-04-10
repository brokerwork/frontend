import { handleActions } from "redux-actions";
import {
  USERINFO_CONFIG_ACCESS,
  USERINFO_GET_BANK_ACCOUNTS,
  USERINFO_GET_BANK,
  USERINFO_GET_FA_DATA,
  GET_GOOGLE_VALIDATE
} from "@/actions/Personal/userInfo";

//  登录注册页SC配置
// export const configAcessResult = handleActions(
//   {
//     [USERINFO_CONFIG_ACCESS]: (state, { payload }) => payload
//   },
//   {}
// );

//  银行信息
export const bankAccounts = handleActions(
  {
    [USERINFO_GET_BANK_ACCOUNTS]: (state, { payload }) => payload
  },
  null
);

//  所有银行
export const allBank = handleActions(
  {
    [USERINFO_GET_BANK]: (state, { payload }) => payload
  },
  null
);

// export const validateSettingData = handleActions(
//   {
//     [USERINFO_GET_FA_DATA]: (state, { payload }) => payload
//   },
//   []
// );
export const googleValidate = handleActions(
  {
    [GET_GOOGLE_VALIDATE]: (state, { payload }) => payload
  },
  {}
);
