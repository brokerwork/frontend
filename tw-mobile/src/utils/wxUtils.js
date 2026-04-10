export default {
	getPreSignupURL() {
		let { appId, appNo, tenantId, compAppId, mobileHost } = window.GlobalVar;
		let redirect_url = encodeURIComponent(`${mobileHost}/v1/wechat/presignup?tenant=${tenantId}`);
		var oauth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=1&component_appid=${compAppId}#wechat_redirect`;
		return oauth_url;
	},
	getWeixinOAuthURL() {
		let { appId, appNo, tenantId, compAppId, mobileHost } = window.GlobalVar;
		let redirect_url = encodeURIComponent(`${mobileHost}/v1/wechat/callback/signup?tenant=${tenantId}`);
		var oauth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=1&component_appid=${compAppId}#wechat_redirect`;
		return oauth_url;
	},
	getBindWeixinURL(key) {
		let { appId, appNo, tenantId, compAppId, mobileHost } = window.GlobalVar;
		let redirect_url = encodeURIComponent(`${mobileHost}/v1/wechat/bind?key=${key}&tenant=${tenantId}`);
		var oauth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=1&component_appid=${compAppId}#wechat_redirect`;
		return oauth_url;
	},
	//	判断微信浏览器
	isWechat() { 
		var ua = window.navigator.userAgent.toLowerCase()
		return ua.match(/MicroMessenger/i) == 'micromessenger'
	}
}