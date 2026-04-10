import { Storage } from './storage';
import { getType as getLanguageType } from './language';
import { getCachedToken } from './userinfo'
import wxUtils from './wxUtils'  
import i18n from './i18n'
import { isFullUrl } from './urlUtils'

function ajax(method, url, headers = null, data = null) {
	let _method = method || '';
	let _url = url || '';
	let _headers = headers || null;
	let _data = data || null;
	_url = isFullUrl(url) ? url : `${window.sessionStorage.getItem('AJAX_PREFIX')||""}${url}`;
	return new Promise((resolve, reject) => {
		let xmlhttp = new XMLHttpRequest();
		if (_data) {
			let paramsUrl
			let paramsArray = []
			Object.keys(_data).forEach((key) => { 
				paramsArray.push(key + '=' + _data[key])
			})
			paramsUrl = paramsArray.join('&')

			if (/get/i.test(_method)) {
				if (_url.search(/\?/) === -1) {
					_url += '?' + paramsUrl
				} else {
					_url += '&' + paramsUrl
				}
			} else { 
				_data = JSON.stringify(_data);
			}
		}
		xmlhttp.open(_method, _url);
		if (_headers !== null) {
			for (let k in _headers) {
				xmlhttp.setRequestHeader(k, _headers[k]);
			}
		}
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
					if (xmlhttp.responseText) {
						resolve(xmlhttp.responseText);
					} else { 
						reject('返回值为空')
					}
				}
				else {
					let error = new Error(xmlhttp.statusText);
					// error.response = xmlhttp;
					//throw error;
					reject(error)
				}
			}
		};
		xmlhttp.send(_data);
	});
}

function parseJson(str) {
	var o = {};
	try {
		o = JSON.parse(str);
		return Promise.resolve(o);
	} catch (e) {
		throw e
	}
}

function errorHandle(json) {
	// if (json && json.result == false) {
	// 	let mcode = i18n.mcode(json.mcode);
	// 	console.log(`Ajax错误: ${mcode}`);
	// 	if (json.mcode == 'PUB_AUTH_0000018') { 
	// 		localStorage.setItem('TOKEN', '')
	// 		if (wxUtils.isWechat()) { 
	// 			return window.location.href = wxUtils.getPreSignupURL()
	// 		}
	// 		window.location.href = '/mobile'
	// 		return false
	// 	}
	// 	return Promise.resolve(json)
	// }
	return Promise.resolve(json)
}

function catchErr(err) { 
	console.log('catch error ~: ', err)
	return err
}

export function post(url, options = {}) {
	var _defaultHeaders = _getCommonAjaxHeaders();
	_defaultHeaders = Object.assign({}, _defaultHeaders, {
		'Content-Type': 'application/json'
	})
	var _headers = Object.assign({}, _defaultHeaders, options.headers);
	var _data = options.data;
	return ajax('POST', url, _headers, _data).then(parseJson).then(errorHandle).catch(catchErr);
}

export function get(url, options = {}) {
	var _defaultHeaders = _getCommonAjaxHeaders();
	var _headers = Object.assign({}, _defaultHeaders, options.headers);
	var _data = options.data;
	return ajax('GET', url, _headers, _data).then(parseJson).then(errorHandle).catch(catchErr);
}

function _getCommonAjaxHeaders() {
	let appId = window.GlobalVar.appId;
	let tenantId = window.GlobalVar.tenantId;
	let headers = {
		"x-app-id": appId,
		"x-tenant-id": tenantId,
		'x-language': getLanguageType(),
		'x-api-token': getCachedToken()
	};
	return headers;
}

export default { post, get }
