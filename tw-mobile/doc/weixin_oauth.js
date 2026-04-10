1.get Access token by code: 
https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx214ff7e919542dbb&secret=f362f5c830573193d5b419ef129ac231&code=0413I7QZ0uTmX121KdPZ0OpRPZ03I7Q3&grant_type=authorization_code

2.get userinfo by access_token and openid
https://api.weixin.qq.com/sns/userinfo?access_token=TAySKpX4F1TFdwCudUBWVIA6Jeaf_6mNZbrFiMKVFeRN8BCe1TXjD2pwvo35M2xKHeVCa2aIFTfDYsGPC4VtPj71zUzvXGtVig3D050vGc4&openid=oTvpbwdcV2hWLkRUjViynTXz-kg8&lang=zh_CN

3. validate web access_token
https://api.weixin.qq.com/sns/auth?access_token=urocFxxa4ona38xmhwYHoytr135qS-RBrth64bk-ESOv10tJ509At2x6VE8TbODEngJsiVKC8-gw-oH2o3aYbwCHAxTOfCLpJHa
3zd5QiE4&openid=oTvpbwdcV2hWLkRUjViynTXz-kg8

appID
wx214ff7e919542dbb
appsecret
f362f5c830573193d5b419ef129ac231
code: 011Ia4TS1WOFR81LxHVS1pl7TS1Ia4Ty

==== 重要问题记录 ===
1. 同一用户在不同公众号的 openid 是否是一样的。
2. PC 微信登录 产生的 id/openid/xxid 和公众号里的是否是一样的。
3. PC 端微信扫码登录