import ActionTypes from './actionTypes';
import { HttpClient } from '../../http/httpclient';
import { IAccountState } from '../store/mt4store';
import { LoadingMask, Message } from 'fooui';
import { I18nLoader } from '../../i18n/loader';
import VenderHelper from '../utils/venderHelper';
import ServerHelper from '../utils/serverHelper';
import PrivilegeHelper from '../../common/privilegeHelper';
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import * as moment from 'moment'

let isFuzzySearch = false;
let fuzzyType = 'accountName';
let fuzzyField = '';

export function setFuzzyType( t:string ) {
  fuzzyType = t;
}

export function setFuzzyField( f:string ) {
  fuzzyField = f;
}

export function setFuzzySearch( flag:boolean ) {
  isFuzzySearch = flag;
}

export function selectAllAccount( selected:boolean ) {
  return {
    type: ActionTypes.SelectAllAccount,
    selected: selected
  }
}

export function selectAccount( id:string, selected:boolean ) {
  return {
    type: ActionTypes.SelectAccount,
    id: id,
    selected: selected
  }
}

export function editAccount( accountId:string ) {
  return {
    type: ActionTypes.EditAccount,
    id: accountId
  }
}

export function hideAccountEditor() {
  return {
    type: ActionTypes.HideAccountEditor
  }
}

export function changeUserSearchType( userSearchType:string ) {
  return {
    type: ActionTypes.ChangeUserSearchType,
    userSearchType: userSearchType
  }
}

export function changeDateRange( startDate:moment.Moment, endDate:moment.Moment ) {
  return {
    type: ActionTypes.ChangeDataRange,
    startDate: startDate,
    endDate: endDate
  }
}

export function fetchAccount( pageNo?:number ) {
  return (dispatch:Function, getState:Function )=>{
    let state:IAccountState = getState();
    let params = {};
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    if ( isFuzzySearch ) {
      params = {
        userSearchType: null,
        fuzzyField: fuzzyField,
        fuzzyType: fuzzyType,
        startDate: null,
        endDate: null,
        pageNo: pageNo || state.accountTable.currentPageNo,
        pageSize: state.accountTable.pageSize
      }
    } else {
      params = {
        userSearchType: state.accountTable.userSearchType,
        fuzzyField: '',
        fuzzyType: '',
        startDate: state.accountTable.startDate.valueOf(),
        endDate: state.accountTable.endDate.valueOf(),
        pageNo: pageNo || state.accountTable.currentPageNo,
        pageSize: state.accountTable.pageSize
      }
    }
    
    LoadingMask.maskAll();
    HttpClient.doPost( '/v1/account/manage/findAccountsInfo', params, extraHeaders).then(res=>{
      if ( res.result && res.data ) {
        dispatch( {
          type: ActionTypes.ReceiveAccount,
          list: res.data.list,
          total: res.data.total,
          currentPageNo: res.data.pageNo,
          totalPageNo: res.data.pages,
          pageSize: res.data.pageSize
        } )
      } else {
        Message.error( I18nLoader.getErrorText(res.mcode) );
      }
      LoadingMask.unmaskAll()
    }).catch(()=>{
      LoadingMask.unmaskAll()
    })
  }
}

export function changePageSize( pageSize:number ) {
  return {
    type: ActionTypes.ChangePageSize,
    pageSize: pageSize
  }
}

export function deleteAccount() {
  return (dispatch:Function, getState:Function)=>{
    let state:IAccountState = getState();
    let selectedIds:any = [];
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    state.accountTable.accountList.forEach( a=>{
      if ( a.selected ) selectedIds.push(a.login)
    } );
    LoadingMask.maskAll();
    HttpClient.doPost( '/v1/account/manage/delete', {
      accounts: selectedIds
    },extraHeaders ).then(res=>{
      if ( res.result ) {
        fetchAccount(1);
      } else {
        Message.error( I18nLoader.getErrorText(res.mcode) );
      }
      LoadingMask.unmaskAll();
    })
  }
}

export function updateEnable( accountId:string, enable:number ) {
  return (dispatch:Function,getState:Function)=>{
    let ACCOUNTMT4_DISABLE_LOGIN = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_DISABLE_LOGIN");
    if (!ACCOUNTMT4_DISABLE_LOGIN){
        Message.error( "您没有该项权限！");
    }else{
        LoadingMask.maskAll();
        let extraHeaders = Object.assign( {}, {
          "x-api-vendor": VenderHelper.getVender(),
          "x-api-serverid":parseInt(ServerHelper.getServer()),
        } )
        HttpClient.doPost( '/v1/account/manage/enable', {
          login: accountId,
          enable: enable
        }, extraHeaders ).then(res=>{
          if ( res.result ) {
            dispatch(fetchAccount())
          } else {
            Message.error( I18nLoader.getErrorText(res.mcode) );
          }
          LoadingMask.unmaskAll();
        })
    }
    
  }
}

export function updateReadonly( accountId:string, readonly:number ) {
  return (dispatch:Function,getState:Function)=>{
    let ACCOUNTMT4_DISABLE = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_DISABLE");
    if (!ACCOUNTMT4_DISABLE){
        Message.error( "您没有该项权限！");
    }else{
        LoadingMask.maskAll();
        let extraHeaders = Object.assign( {}, {
          "x-api-vendor": VenderHelper.getVender(),
          "x-api-serverid":parseInt(ServerHelper.getServer()),
        } )
        HttpClient.doPost( '/v1/account/manage/readOnly', {
          login: accountId,
          readOnly: readonly
        }, extraHeaders ).then(res=>{
        if ( res.result ) {
          dispatch(fetchAccount())
        } else {
          Message.error( I18nLoader.getErrorText(res.mcode) );
        }
        LoadingMask.unmaskAll();
      })
    }  
  }
}
export function selectSever() {
  let vendor  = VenderHelper.getVender();
  return (dispatch:Function,getState:Function)=>{
    HttpClient.doGet( '/v1/account/dropdown/' + vendor + '/servers', {
    // HttpClient.doGet( '/v1/tenants/metadata/field/option/countryCode', {
    } ).then(res=>{
      if ( res.result && res.data  ) {
            dispatch({
              type:ActionTypes.SELECTSEVER,
              list:res.data
          })
      } else {
        Message.error( I18nLoader.getErrorText(res.mcode) );
      }
    })
  }
}