import { createAction } from 'redux-actions'
import uuid from 'uuid'
import api from '../utils/api'
import {
  getCountry,
  saveCountry,
  getCountryCode,
  saveCountryCode,
  isCountryCodeExist,
  getVersion,
  setVersion,
  isCountryExist,
  saveNation,
  getNation
} from 'utils/country';
import { getType } from 'utils/country'
import { updateI18n } from 'utils/i18n';
import language from 'utils/language';

export const COMMON_UPDATE_DEPOSIT_CONFIG = 'COMMON_UPDATE_DEPOSIT_CONFIG';
export const COMMON_UPDATE_SELECTED_ACCOUNT = "COMMON_UPDATE_SELECTED_ACCOUNT";
export const COMMON_UPDATE_USER_INFO = 'COMMON_UPDATE_USER_INFO';
export const COMMON_FETCH_BRAND_INFO = 'COMMON_FETCH_BRAND_INFO';
export const COMMON_APP_READY = 'APP_PRELOAD_DATA_READY';
export const COMMON_GET_LANGUAGE = `COMMON_GET_LANGUAGE`;
export const IS_LOADING = 'IS_LOADING';
export const GET_STRUCTURAL_LIST = 'GET_STRUCTURAL_LIST'
export const OPEN_MSG_DIALOG = 'OPEN_MSG_DIALOG'
export const CLOSE_MSG_DIALOG = 'CLOSE_MSG_DIALOG'
export const COMMON_GET_COUNTRY_PHONE = 'COMMON_GET_COUNTRY_PHONE'
export const COMMON_GET_COUNTRIES = 'COMMON_GET_COUNTRIES'
export const COMMON_GET_COUNTRIESVERSION = 'COMMON_GET_COUNTRIESVERSION'
export const COMMON_GET_NATION = 'COMMON_GET_NATION'
export const COMMON_FETCH_SERVER_NAME_ORAF = 'COMMON_FETCH_SERVER_NAME_ORAF'
export const COMMON_FETCH_DISCLAIMER = 'COMMON_FETCH_DISCLAIMER'
export const VISIBLE_MODULES = 'VISIBLE_MODULES'
export const COMMON_CHECK_LANGUAGEVERSION = 'COMMON_CHECK_LANGUAGEVERSION'
export const COMMON_CHANGE_LANGUAGE = 'COMMON_CHANGE_LANGUAGE'
export const COMMON_CHECK_TOKEN = 'COMMON_CHECK_TOKEN'
export const GET_OSS_SIGNATURE = 'GET_OSS_SIGNATURE'

export let msgDialog = createAction(
	OPEN_MSG_DIALOG,
	(msg) => msg
)

export let closeMsgDialog = createAction(
	CLOSE_MSG_DIALOG
)

export let updateLoading = createAction(
	IS_LOADING,
	(boolean) => boolean
)

export let updateDepositConfig = createAction(
	COMMON_UPDATE_DEPOSIT_CONFIG,
	(config) => config
)

export let updateSelectedAccount = createAction(
	COMMON_UPDATE_SELECTED_ACCOUNT,
	(selectedAcct) => selectedAcct
)

export let updateUserInfo = createAction(
	COMMON_UPDATE_USER_INFO,
	(userinfo) => userinfo
)

export let fetchBrandInfo = createAction(
	COMMON_FETCH_BRAND_INFO,
	() => {
		// let url = '/v1/ops/product/conf/brand?productId=TW';
		// return get(url)
		return api.get('/api/v1/config/brand?productId=TW').then(res=>{
			if(res.result){
				window.GlobalVar.tenantId = res.data.tenantId
			}
			return Promise.resolve(res)
		})
	}
)

export let setAppReady = createAction(
	COMMON_APP_READY,
	(isReady) => isReady
)

//	更新配置信息
export let getStructuralList = createAction(
	GET_STRUCTURAL_LIST,
	() => { 
		return api.get('/api/v1/ops/product/conf/structural/list')
	}
)

// 检查国际化语言包版本信息
export const checkLanguageVersion = createAction(
    COMMON_CHECK_LANGUAGEVERSION,
    () => dispatch => api.get('/api/v1/static/version').then(res => {
			if (res.result) {
				let currentVersion = language.getLanguageVersion();
				if(!language.isLanguageExist() || currentVersion<res.data){
					language.setLanguageVersion(res.data)
					dispatch(getLanguage())
				}
			}
			return res
		})
)

// 获取国际化语言包
export const getLanguage =  createAction(
  COMMON_GET_LANGUAGE,
  (type=language.getType()) => api.get(`/api/v1/static/language2?project=PUB,TW,BW,SC,TWPAGE&lang=${type}`).then(res => {
		if (res.result) {
			language.set(res.data);
			updateI18n();
		}
		return res
	})
)

//	获取国家代码数据
export const getCountryPhone = createAction(
	COMMON_GET_COUNTRY_PHONE,
	() => { 
		if (!isCountryCodeExist()) {
			return api.get('/api/v1/ops/tenants/metadata/field/option/countryCode').then(res => {
				if (res.result) {
					saveCountryCode(res.data)
				}
				return Promise.resolve(res)
			})
		} else { 
			return Promise.resolve({
				data: getCountryCode(),
				result: true
			})
		}
	}
)

// 获取国家信息
export const getCountryInfo = createAction(
    COMMON_GET_COUNTRIES,
	() => { 
		const languageType = language.getType()
		const fetchNations = () => {
			return api.get(`/api/v1/static/countryCityAll?lang=${languageType}`).then(res => {
                if (res.result) {
                    saveCountry(res.data)
                }
                return Promise.resolve(res)
            })
		}
		if(isCountryExist()){
			return getCountriesVersion().then((res) => { 
				if (res.result) {
					let currentVersion = getVersion()
					if (currentVersion < res.data) {
						setVersion(res.data)
						return fetchNations()
					} else { 
						return Promise.resolve({
							data: getCountry(),
							result: true
						})
					}
				}
			})
        }else{
			getCountriesVersion().then(res => {
				if (res.result) setVersion(res.data)
				
            })
            return fetchNations()
        }
	}
)

// 获取国家版本信息
export const getCountriesVersion = () => {
	return api.get('/api/v1/ops/tenants/nation/version').then(res => {
		if (res.result) {
			return res
		}
		return res
	})
}

//	获取国家value
export const getNationInfo = createAction(
	COMMON_GET_NATION,
	() => {
		if (!getNation()) {
			const languageType = language.getType()
			return api.get(`/api/v1/ops/tenants/nation?lang=${languageType}`).then((res) => {
				if (res.result) {
					saveNation(res.data)
				}
				return Promise.resolve(res)
			})
		} else {
			return Promise.resolve({
				data: getNation(),
				result: true
			})
		}
	}
)

export const commonServerName = createAction(
	COMMON_FETCH_SERVER_NAME_ORAF,
	() => { 
		return api.get('/v1/mobile/account/open/refer')
	}
)

export const commonDisclaimer = createAction(
	COMMON_FETCH_DISCLAIMER,
	(vendor) => {
		return api.get(`/v1/mobile/disclaimer?vendor=${vendor}`)
	}
)

//切换应用语言
export const changeLanguage = createAction(
	COMMON_CHANGE_LANGUAGE,
	type => dispatch => {
		language.setType(type)
		Promise.all([dispatch(getLanguage(type))]).then((res) => {
			console.log('切换语言成功！')
			window.location.reload(true)
		})
	}
)

export const visibleModules = createAction(
	VISIBLE_MODULES,
	() => { 
		return api.get('/v1/mobile/version/modules')
	}
)

// 校验当前token是否有效，依此重定向页面
export const checkToken = createAction(
    COMMON_CHECK_TOKEN,
	() => api.get('/api/v1/user/token').then(res=>Promise.resolve(res))
)
	
//  选择图片后调用
export const getOssSignature = createAction(
    GET_OSS_SIGNATURE,
    (tenantId) => { 
        return api.get(`/api/ali/oss/signature?bucket=leanwork-fs&fid=${tenantId}/${uuid.v1()}`)
    }
)