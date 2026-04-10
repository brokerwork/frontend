import { IAccountState } from '../store/mt4store';
import { LoadingMask, Message } from 'fooui';
import ActionTypes from './actionTypes';
import { HttpClient } from '../../http/httpclient';
import { fetchAccount } from './accountTableActions';
import { I18nLoader } from '../../i18n/loader';
import FinInfo from '../model/finInfo';
import VenderHelper from '../utils/venderHelper';
import ServerHelper from '../utils/serverHelper';
import Account from '../model/account';

export function initEditAccountCard() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    if (state.editAccount.workAgeArray.length > 0 && state.addAccount.nationalityArray.length > 0) {
      return;
    }
    LoadingMask.maskAll();
    HttpClient.doGet('/v1/account/dropdown/list/workAge').then(res => {
      if (res.result && res.data) {
        dispatch({
          type: ActionTypes.ReceiveWorkAge,
          list: res.data
        })
      }
      return HttpClient.doPost('/v1/static/country_city?parent_id=0&lang=zhCN');
    }).then(res => {
      if (res.result && res.data) {
        dispatch({
          type: ActionTypes.ReceiveNationality,
          list: res.data
        })
      }
      LoadingMask.unmaskAll();
    }).catch(error => {
      LoadingMask.unmaskAll();
    });
  }
}

export function initEditAccInfoCard() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    LoadingMask.maskAll();
    let extraHeaders = Object.assign({}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid": parseInt(ServerHelper.getServer()),
    })
    HttpClient.doGet('/v1/account/dropdown/groups', {}, extraHeaders).then(res => {//初始化账户组下拉选项
      if (res.result && res.data) {
        dispatch({
          type: ActionTypes.ReceiveAccountGroup,
          list: res.data
        })
      }
      return HttpClient.doPost('/v1/user/listAll', {//获取账户归属
        endDate: 0,
        orderDesc: false,
        pageNo: 0,
        queryContent: null,
        startDate: 0,
        tenantId: null,
        userSearchType: null
      })
    }).then(res => {
      if (res.result && res.data) {
        dispatch({
          type: ActionTypes.ReceiveUserBelongTo,
          list: res.data
        })
      }
      LoadingMask.unmaskAll()
    }).catch(error => {

      LoadingMask.unmaskAll()
    })
  }
}

export function fetchAllCustomers(criteria = {}) {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    var url = '/v1/custom/profiles/list';
    var param = {
      fuzzyItem: null,
      fuzzyVal: null,
      nowPage: 1,
      pageSize: 10,
      searchDate: null,
      searchEnd: null,
      searchStart: null,
      senseItem: null,
      senseList: null,
      tenantId: "T001001"
    };
    param = Object.assign(param, criteria);
    LoadingMask.maskAll();
    HttpClient.doPost(url, param).then(res => {
      dispatch({
        type: ActionTypes.FETCH_CUSTOMERS,
        list: res.data.list
      })
      LoadingMask.unmaskAll()
    }).catch(() => {
      LoadingMask.unmaskAll()
    })
  }

}

export function updateBaseInfo(accountInfoObj: any) {
  // return update('/v1/account/manage/updateBaseInfo', accountInfoObj)
  return (dispatch: Function, getState: Function) => {
    let extraHeaders = Object.assign({}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid": parseInt(ServerHelper.getServer()),
    });
    LoadingMask.maskAll();
    HttpClient.doPost('/v1/account/manage/updateBaseInfo', accountInfoObj, extraHeaders).then(res => {
      if (res.result) {
        Message.success('保存成功');
        dispatch({
          type: ActionTypes.HideEditAccountCard
        })
        dispatch(fetchAccount());
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll();
    })
  }
}
export function updateAccInfo(accountInfoObj: any) {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    let params = Object.assign({}, accountInfoObj, {
      login: state.editAccount.currentAccountId,
      // enable: accountInfoObj.enable,
      // readOnly: accountInfoObj.enableReadonly,
      // externalInfo: {
      //   userGroup: accountInfoObj.group,
      //   userId: accountInfoObj.userId,
      //   userName: accountInfoObj.userName,
      //   customerId: accountInfoObj.customerId,
      //   customerName: accountInfoObj.customerName
      // }
    })
    let extraHeaders = Object.assign({}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid": parseInt(ServerHelper.getServer()),
    })
    LoadingMask.maskAll();
    HttpClient.doPost('/v1/account/manage/updateAccountInfo', params, extraHeaders).then(res => {
      if (res.result) {
        Message.success('保存成功');
        dispatch({
          type: ActionTypes.HideEditAccountCard
        })
        dispatch(fetchAccount());
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll();
    })
  }
}

export function changeAccountEditorCardTab(eventKey: any) {
  return {
    type: ActionTypes.ChangeAccountEditorCardTab,
    eventKey: eventKey
  }
}

export function updateFinInfo(finInfoObj: FinInfo) {
  // return update('/v1/account/manage/financial/update', finInfoObj)
  return (dispatch: Function, getState: Function) => {
    const state = getState();
    let extraHeaders = Object.assign({}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid": parseInt(ServerHelper.getServer()),
    });
    LoadingMask.maskAll();
    HttpClient.doPost('/v1/account/manage/financial/update', Object.assign({}, finInfoObj, {
      login: state.editAccount.currentAccountId,
    }), extraHeaders).then(res => {
      if (res.result) {
        Message.success('保存成功');
        dispatch({
          type: ActionTypes.HideEditAccountCard
        })
        dispatch(fetchAccount());
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll();
    })
  }
}

export function initFinInfoPanel() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    let initialization: any = {};
    let promiseChainArray: any = [];
    let initializationPropNames: Array<string> = [];

    LoadingMask.maskAll()
    if (state.editAccount.assetsRangeArray.length === 0) {
      promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/list/assetsRange'))
      initializationPropNames.push('assetsRangeData');
    }
    if (state.editAccount.investmentYearArray.length === 0) {
      promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/list/investmentYear'))
      initializationPropNames.push('investmentYearData');
    }
    if (state.editAccount.knowledgeLevelArray.length === 0) {
      promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/list/knowledgeLevel'))
      initializationPropNames.push('knowledgeLevelData');
    }
    if (state.editAccount.incomeSourceArray.length === 0) {
      promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/list/incomeSource'))
      initializationPropNames.push('incomeSourceData');
    }
    if (state.editAccount.investmentExperienceArray.length === 0) {
      promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/list/investmentExperience'))
      initializationPropNames.push('investmentExperienceData');
    }

    Promise.all(promiseChainArray).then(resArray => {
      for (let i = 0; i < initializationPropNames.length; i++) {
        let res: any = resArray[i];
        let proName = initializationPropNames[i];
        if (res.result) {
          initialization[proName] = res.data
        } else {
          throw new Error('财务信息初始化失败[' + proName + ']')
        }
      }
      if (resArray.length > 0) {
        dispatch({
          type: ActionTypes.InitFinInfo,
          initialization: initialization
        })
      }
      dispatch(fetchFinInfo())
    }).catch(error => {
      console.error(error)
      Message.error(error.msg)
    })
  }
}

export function fetchFinInfo() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    let currentAccountId = state.editAccount.currentAccountId;
    LoadingMask.maskAll();
    HttpClient.doGet(`/v1/account/manage/financial/${currentAccountId}`, {}, {
      'x-api-serverid': ServerHelper.getServer(),
      'x-api-vendor': VenderHelper.getVender(),
    }).then(res => {
      if (res.result) {
        dispatch({
          type: ActionTypes.ReceiveFinInfo,
          data: res.data || {} // 如果没有财务信息，后台不会有data这个字段
        })
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll();
    })
  }
}


export function updateLeverage(newLeverage: any, sendEmail: number) {
  return update('/v1/account/manage/updateLeverage', {
    leverage: newLeverage,
    sendEmail: sendEmail
  })
}

export function updatePwd(pwd: string, investmentPwd: string, sendEmail: number) {
  return update('/v1/account/manage/updatePassword', {
    password: pwd,
    investorPassword: investmentPwd,
    sendEmail: sendEmail
  })
}

export function initCerInfo() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    let promiseArray: any = [];
    let initObjPropNamesArray: any = [];
    let initObj: any = {};


    LoadingMask.maskAll();
    if (state.editAccount.identityTypeArray.length === 0) {
      promiseArray.push(HttpClient.doGet('/v1/account/dropdown/list/identityType'))
      initObjPropNamesArray.push('identityTypeArray');
    }
    if (state.editAccount.addressTypeArray.length === 0) {
      promiseArray.push(HttpClient.doGet('/v1/account/dropdown/list/addressType'))
      initObjPropNamesArray.push('addressTypeArray');
    }

    promiseArray.push(HttpClient.doGet(`v1/account/manage/certificates/${state.editAccount.currentAccountId}`, {}, {
      'x-api-serverid': ServerHelper.getServer(),
      'x-api-vendor': VenderHelper.getVender()
    }));
    initObjPropNamesArray.push('certInfo');

    Promise.all(promiseArray).then(resArray => {
      for (let i = 0; i < resArray.length; i++) {
        initObj[initObjPropNamesArray[i]] = resArray[i].data;
        if (initObjPropNamesArray[i] === 'certInfo') initObj[initObjPropNamesArray[i]] = initObj[initObjPropNamesArray[i]] || {}
      }
      dispatch({
        type: ActionTypes.InitCerInfo,
        initialization: initObj
      })
      LoadingMask.unmaskAll();
    })
  }
}

export function updateCertInfo(certInfo: any) {
  return update('/v1/account/manage/certificates/update', certInfo)
}

export function initLeveragePanel() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    if (state.addAccount.leverageArray.length > 0) return;

    LoadingMask.maskAll();
    HttpClient.doGet('/v1/tenants/metadata/field/option/leverage').then(res => {
      if (res.result && res.data) {
        dispatch({
          type: ActionTypes.ReceiveLeverage,
          list: res.data
        })
      }
      LoadingMask.unmaskAll()
    })
  }
}

function update(url: string, params: any) {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    let Params = Object.assign(params, {
      accounts: [state.editAccount.currentAccountId],
      login: state.editAccount.currentAccountId
    })
    let extraHeaders = Object.assign({}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid": parseInt(ServerHelper.getServer()),
    })
    LoadingMask.maskAll();
    HttpClient.doPost(url, Params, extraHeaders).then(res => {
      if (res.result) {
        Message.success('保存成功');
        dispatch({
          type: ActionTypes.HideEditAccountCard
        })
        dispatch(fetchAccount());
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll();
    })
  }
}

export function hideEditAccountCard () {
  return {
    type: ActionTypes.HideEditAccountCard
  }
}

export function getCertificatesFields () {
  return {
    type: ActionTypes.FETCH_CERTIFICATES_FIELDS,
    payload: HttpClient.get('/v1/tenants/metadata/form-field/list?tableName=t_account_id_info')
  }
}
export function getBasicFields () {
  return {
    type: ActionTypes.FETCH_BASIC_FIELDS,
    payload: HttpClient.get('/v1/tenants/metadata/form-field/list?tableName=t_account_profiles')
  }
}
export function getPhoneCountryCode () {
  return {
    type: ActionTypes.FETCH_PHONE_COUNTRY_CODE,
    payload: HttpClient.get('/v1/tenants/metadata/field/option/countryCode')
  }
}
export function getFinanceFields () {
  return {
    type: ActionTypes.FETCH_FINANCE_FIELDS,
    payload: HttpClient.get('/v1/tenants/metadata/form-field/list?tableName=t_account_finacial')
  }
}
export function getAccountFields () {
  return {
    type: ActionTypes.FETCH_ACCOUNT_FIELDS,
    payload: HttpClient.get('/v1/tenants/metadata/form-field/list?tableName=t_account_account')
  }
}

export function withdraw(amount: number, remark: string, sendEmail: number) {
  return update('/v1/account/manage/withdraw', {
    amount: amount,
    remark: remark,
    sendEmail: sendEmail
  })
}

export function deposit(amount: number, remark: string, sendEmail: number) {
  return update('/v1/account/manage/deposit', {
    amount: amount,
    remark: remark,
    sendEmail: sendEmail
  })
}

export function transfer(amount: number, remark: string, sendEmail: number, toLogin: string) {
  return update('/v1/account/manage/transfer', {
    amount: amount,
    remark: remark,
    sendEmail: sendEmail,
    toLogin: toLogin
  })
}

export function creditIn(creditAmount: number, amount: string, comment: number, expirationTime: string) {
  return update('/v1/account/manage/credit/in', {
    amount: amount,
    creditAmount: creditAmount,
    comment: comment,
    expirationTime: expirationTime
  })
}
export function creditOut(creditAmount: number, amount: string, comment: number, expirationTime: string) {
  return update('/v1/account/manage/credit/out', {
    amount: amount,
    creditAmount: creditAmount,
    comment: comment,
    expirationTime: expirationTime
  })
}
