let encryptUrl = [{ path: '/v1/user/login', rsaEncrypt: true }];
if (__ENCRYPT__) {
  encryptUrl = [
    // // rsa 加密
    { path: '/v1/user/login', rsaEncrypt: true }
    // // { path: '/v1/user/reset/password/**', rsaEncrypt: true },
    // // { path: '/v1/user/forget/password/**', rsaEncrypt: true },
    // // { path: '/v1/user/register/**', rsaEncrypt: true },
    // // // aes加密
    // { path: '/v1/level/update', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/oplog/page', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/oplog/type', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/statistic/query/trend', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v2/custom/profiles/list', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v3/custom/profiles/list', aesEncrypt: true, aesDecrypt: true },
    // {
    //   path: '/v2/custom/profiles/check/new\\?module=(customer|contact|conatct)',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // },
    // {
    //   path: '/v1/custom/log/[a-z0-9-]+/list',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // },
    // { path: '/v1/custom/contact/add', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/custom/profiles/add', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/custom/contact/list', aesEncrypt: true, aesDecrypt: true },
    // {
    //   path: '/v1/custom/contact/detail/[a-z0-9-]+',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // },
    // // 20171205 add encrypt
    // { path: '/v1/user/list', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v2/user/list', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/user/addUser', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/user/detail/\\d+', aesEncrypt: true, aesDecrypt: true },
    // { path: '/v1/user/updateUser', aesEncrypt: true, aesDecrypt: true },
    // {
    //   path: '/v1/account/manage/findAccountsInfo',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // },
    // { path: '/v2/account/info/\\d+', aesEncrypt: true, aesDecrypt: true },
    // {
    //   path: '/v2/account/owner/update/byAccount/\\d+',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // },
    // {
    //   path: '/v1/account/manage/updatePassword',
    //   aesEncrypt: true,
    //   aesDecrypt: true
    // }
    // // { path: '/v1/user/pwd/modify', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v1/user/list', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v1/user/addUser', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v1/user/updateUser', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v2/user/info/update', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v2/user/commission/update', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v1/custom/profiles/update', aesEncrypt: true, aesDecrypt: true },
    // // { path: '/v2/custom/profiles/list', aesEncrypt: true, aesDecrypt: true },
    // // {
    // //   path: '/v1/account/manage/findAccountsInfo',
    // //   aesEncrypt: true,
    // //   aesDecrypt: true
    // // },
    // // {
    // //   path: '/v2/account/owner/update/byAccount/**',
    // //   aesEncrypt: true,
    // //   aesDecrypt: true
    // // },
    // // { path: '/v1/account/manage/**', aesEncrypt: true, aesDecrypt: true }
  ];
}
export default encryptUrl;
