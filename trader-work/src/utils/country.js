/**
 *国家城市数据,用于三级级联
 *(这里包含了所有数据，手动禁用的国家需要从COUNTRY_NATION_KEY中过滤一次，即以COUNTRY_NATION_KEY中数据为目录)
 *http://broker-static.oss-cn-hangzhou.aliyuncs.com/${newVer}/${type}_CityAll
 */
export const COUNTRY_KEY = 'CACHEDCOUNTRIES'
let countryList//e.g. [{pid:"0",id:"1",value:"中国大陆"},{pid:"1",id:"2",value:"北京"}]
export const getCountry = () => {
    if (!countryList){
        const country = window.localStorage.getItem(COUNTRY_KEY)
        countryList = JSON.parse(country)
    }
    return countryList
}
let countryObject//e.g. {"1":{pid:"0",id:"1",value:"中国大陆"},"2":{pid:"1",id:"2",value:"北京"}}
export const getCountryObject = () => {
    if (!countryObject) {
        countryObject = {}
        getCountry().forEach(e => {
            countryObject[e.id] = e
        })
    }
    return countryObject
}
export function isCountryExist() {
    return !!window.localStorage.getItem(COUNTRY_KEY)
}
export const saveCountry = v => {
    window.localStorage.setItem(COUNTRY_KEY, JSON.stringify(v))
}
//====================================================================
/**
 *国家code代码，仅用于手机号前缀
 *'/v1/ops/tenants/metadata/field/option/countryCode'
 */
export const COUNTRY_CODE_KEY = 'PHONE_CODE'

export function isCountryCodeExist() {
    return !!window.localStorage.getItem(COUNTRY_CODE_KEY)
}
export const saveCountryCode = v => {
    v = v.map(e => { 
        e.value = '+' + e.value
        return e
    })
    window.localStorage.setItem(COUNTRY_CODE_KEY, JSON.stringify(v))
}
export const getCountryCode = () => {
  const country = window.localStorage.getItem(COUNTRY_CODE_KEY)
  return JSON.parse(country)
}
//====================================================================
/**
 *国家数据，从sc获取，在国家下拉列表中使用，比如税号、国籍等
 *'/v1/ops/tenants/nation?lang=${language.getType()}'
 */
export const COUNTRY_NATION_KEY = 'COUNTRY_NATION'
let nationData
export function isNationExist() { 
  return !!window.localStorage.getItem(COUNTRY_NATION_KEY)
}
export const saveNation = v => { 
  window.localStorage.setItem(COUNTRY_NATION_KEY, JSON.stringify(v))
}
export const getNation = () => { 
    if (!nationData) {
        nationData = JSON.parse(window.localStorage.getItem(COUNTRY_NATION_KEY) || '[]')
    }
    return nationData
}
let nationObject//e.g. {"1":{id:"1",value:"中国大陆"},"3249":{id:"3249",value:"香港"}}
export const getNationObject = () => {
    if (!nationObject) {
        nationObject = {}
        getNation().forEach(e => {
            nationObject[e.id] = e
        })
    }
    return nationObject
}