export class UserInfo {
  constructor(data){
		this.name = data.name;
		this.email = data.email;
    this.language = data.language;
    this.lastLoginTime = data.lastLoginTime;
    this.phone = data.phone;
    this.token = data.token;
    this.userId = data.userId;
		this.wxname = data.wxname;
  }
}
export function getCachedToken(){
  let token = localStorage.getItem('TOKEN');
  return token || 'unkown'
}
export function setCachedToken(token){
  localStorage.setItem('TOKEN', token);
}
export function getCachedUserInfo(){
	let s = localStorage.getItem('USER_INFO');
	let userinfo = {};
	try{
		userinfo = JSON.parse(s);
	}catch(e){
		console.error('parse USER_INFO in browser storage fail')
	}
	return userinfo;
}
export function setCachedUserInfo(userinfo={}){
	localStorage.setItem('USER_INFO', JSON.stringify(userinfo))
}