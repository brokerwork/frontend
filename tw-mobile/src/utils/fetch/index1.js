import 'whatwg-fetch'
import 'core-js/es6/promise'

import i18n from '../i18n'
import { getCachedToken } from '../userinfo'
import { getType as getLanguageType } from '../language'

function ajax(method = "GET", url = '', data = {}, headers = {}) {
    
    const defaultHeaders = Object.assign({}, {
        'Content-Type': 'application/json',
        'x-language': getLanguageType(),
        'x-api-token': getCachedToken(),
		"x-app-id": window.GlobalVar.appId,
		"x-tenant-id": window.GlobalVar.tenantId
    }, headers)
    
    let body
    if (data) {
        let paramsUrl
        let paramsArray = []
        Object.keys(data).forEach((key) => { 
            paramsArray.push(key + '=' + data[key])
        })
        paramsUrl = paramsArray.join('&')
        if (/get/i.test(method)) {
            if (url.search(/\?/) === -1) {
                url += '?' + paramsUrl
            } else {
                url += '&' + paramsUrl
            }
        } else { 
            body = JSON.stringify(data)
        }
    }

    return fetch(url, {
        body: body,
        method: method,
        headers: defaultHeaders,
        credentials: 'same-origin'
    }).then((res) => {
        if (res.status >= 200 && res.status < 400) {
            return res
        } else {
            throw new Error(res.statusText)
        }
    }).then((res) => {
        try {
            return res.json()
        } catch(err){ 
            return res.text()
        }
    }).then((result) => {
        return result
     })
}

const get = (url, options = { data: {}, headers: {} }) => { 
    return ajax('GET', url, options.data, options.headers)    
}

const post = (url, options = { data: {}, headers: {} }) => { 
    return ajax('POST', url, options.data, options.headers)
}

export { get, post }