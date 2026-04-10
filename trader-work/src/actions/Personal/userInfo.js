import api from "@/api";
import { createAction } from "redux-actions";
import { ls, USER_INFO } from "@/utils/storage";
const PREFIX = "USERINFO_";
export const USERINFO_MODIFY_USER_NAME = "USERINFO_MODIFY_USER_NAME";
export const USERINFO_MODIFY_PSWD = "USERINFO_MODIFY_PSWD";
export const USERINFO_CONFIG_ACCESS = "USERINFO_CONFIG_ACCESS";
export const USERINFO_MODIFY_EMAIL = "USERINFO_MODIFY_EMAIL";
export const USERINFO_GET_CODE = "USERINFO_GET_CODE";
export const USERINFO_MODIFY_PHONE = "USERINFO_MODIFY_PHONE";
export const USERINFO_GET_BANK_ACCOUNTS = "USERINFO_GET_BANK_ACCOUNTS";
export const USERINFO_GET_BANK = "USERINFO_GET_BANK";
export const USERINFO_ADD_BANK = "USERINFO_ADD_BANK";
export const USERINFO_UPDATE_BANK = "USERINFO_UPDATE_BANK";
export const USERINFO_DELETE_BANK = "USERINFO_DELETE_BANK";
export const USERINFO_GET_FA_DATA = `${PREFIX}GET_FA_DATA`;
export const SET_FA_SETTING = `${PREFIX}SET_FA_SETTING`;
export const DELETE_FA_SETTING = `${PREFIX}DELETE_FA_SETTING`;
export const GET_GOOGLE_VALIDATE = `${PREFIX}GET_GOOGLE_VALIDATE`;
export const SEND_VALIDATE = `${PREFIX}SEND_VALIDATE`;
export const VERIFY_VALIDATE_CODE = `${PREFIX}VERIFY_VALIDATE_CODE`;

//  获取SC配置
// export const configAccess = createAction(USERINFO_CONFIG_ACCESS, () => {
//   return api.get("/v1/config/access");
// });

// 修改用户名
export const modifyUserName = createAction(USERINFO_MODIFY_USER_NAME, params =>
    api.post("/v1/user/username", params).then(rs=>{
        if(rs.result){
            ls.setItem(USER_INFO, rs.data);
        }
        return rs
    })
);

//  修改密码
export const modifyPswd = createAction(USERINFO_MODIFY_PSWD, params =>
  api.post("/v2/user/pwd/modify", params)
);

//  修改邮箱
export const modifyEmail = createAction(USERINFO_MODIFY_EMAIL, params =>
  api.post("/v1/user/bind/mail", params)
);

//  获取手机验证码
export const getCheckCode = createAction(USERINFO_GET_CODE, (code, phone) =>
  api.get(
    `/v2/user/phone/captcha/withtoken?phone=${phone}&countryCode=${code}&validateType=UpdatePhoneNumber`
  )
);

//  修改手机
export const modifyPhone = createAction(USERINFO_MODIFY_PHONE, params =>
  api.post("/v1/user/bind/phone", params)
);

//  获取银行信息
export const getBankAccounts = createAction(
  USERINFO_GET_BANK_ACCOUNTS,
  params => api.get("/v1/userdetail/bank/accounts")
);

//  获取所有银行
export const getAllBank = createAction(USERINFO_GET_BANK, params =>
  api.get("/v1/ops/tenants/metadata/field/option/bankAccount")
);

//  提交新增银行
export const addNewBank = createAction(USERINFO_ADD_BANK, params =>
  api.post("/v1/userdetail/bank/account/new", params)
);

//  更新银行信息
export const updateBank = createAction(USERINFO_UPDATE_BANK, params =>
  api.post("/v1/userdetail/bank/account/update", params)
);

//  删除银行
export const deleteBank = createAction(USERINFO_DELETE_BANK, params =>
  api.post(`/v1/userdetail/bank/account/delete?bankAccountId=${params}`)
);

// 获取fa设置数据
// export const getFaData = createAction(USERINFO_GET_FA_DATA, token =>
//   api.get("/v1/tw/user/2fa/setting", null, token)
// );
// 设置fa
// params: {
//     "type" :"GoogleAuthenticator", //如果是SMS，没有detail
//     "detail" : {
//         "secret" : "ZXFVI4T6CXZSO6QG"
//     }
// }
export const setFaSetting = createAction(SET_FA_SETTING, (params, token) =>
  api.post("/v1/tw/user/2fa/setting", params, token)
);
// 取消fa
export const cancelFaSetting = createAction(DELETE_FA_SETTING, params =>
  api.delete("/v1/tw/user/2fa/setting", params)
);
// 获取谷歌二验证二维码和秘钥
export const getGoogleValidate = createAction(GET_GOOGLE_VALIDATE, () =>
  api.get("/v1/tw/user/2fa/google")
);
// 发送验证码
// params : {
//     验证方式
//     "type" :"SMS",
//     "operation" :"LOGIN",
// }

export const sendValidateCode = createAction(SEND_VALIDATE, (params, token) =>
  api.post("/v1/tw/user/2fa/send", params, token)
);
// 获取谷歌二验证二维码和秘钥
export const verifyValidateCode = createAction(
  VERIFY_VALIDATE_CODE,
  (params, token) => api.post("/v1/tw/user/2fa/verify", params, token)
);
