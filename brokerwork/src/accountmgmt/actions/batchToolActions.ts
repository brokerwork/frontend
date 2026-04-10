import { IAccountState } from '../store/mt4store';
import ActionTypes from './actionTypes';
import { HttpClient } from '../../http/httpclient';
import { LoadingMask, Message } from 'fooui';
import { I18nLoader } from '../../i18n/loader';
import VenderHelper from '../utils/venderHelper';
import ServerHelper from '../utils/serverHelper';
export function initDivide() {
  return ( dispatch:Function, getState:Function )=>{
    let state:IAccountState = getState();
    // userBelongTo 应该抽象到一个commone reducer里面，因为几个地方都要用，
    // 但是懒得改造了，先这么用着
    if ( state.editAccount.userBelongToArray.length === 0 ) {
      LoadingMask.maskAll();
      HttpClient.doPost( '/v1/user/listAll', {//获取账户归属
        endDate:0,
        orderDesc:false,
        pageNo:0,
        queryContent:null,
        startDate:0,
        tenantId:null,
        userSearchType:null
      } ).then(res=>{
        if ( res.result && res.data ) {
          dispatch({
              type:ActionTypes.ReceiveUserBelongTo,
              list:res.data
          })
        }
        LoadingMask.unmaskAll()
      }).catch(error => {
        
        LoadingMask.unmaskAll()
      })
    }
  }
}
// 批量划转
export function divide( toUserId:string, toUserName:string ) {
  return (dispatch:Function, getState:Function)=>{
    let state:IAccountState = getState();
    let accountArray = state.accountTable.accountList;
    let selectedAccountIds:Array<string> = [];
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    accountArray.forEach( a=>{
      if ( a.selected ) {
        selectedAccountIds.push( a.login )
      }
    } )
    LoadingMask.maskAll()
    return HttpClient.doPost( '/v1/account/manage/setOwnership', {
      vendor: VenderHelper.getVender(),
      userId: toUserId,
      userName: toUserName,
      accounts: selectedAccountIds
    }, extraHeaders );
  }
}

export function initAccountGroup() {
  return ( dispatch:Function, getState:Function )=>{
    let state:IAccountState = getState();
    // accountGroup 应该抽象到一个commone reducer里面，因为几个地方都要用，
    // 但是懒得改造了，先这么用着
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    if ( state.editAccount.accountGroupArray.length === 0 ) {
      LoadingMask.maskAll();
      HttpClient.doGet( '/v1/account/dropdown/groups',{},extraHeaders ).then(res=>{ // 用户组
        if ( res.result && res.data ) {
          dispatch({
              type:ActionTypes.ReceiveAccountGroup,
              list:res.data
          })
        }
        LoadingMask.unmaskAll()
      }).catch(error => {
        
        LoadingMask.unmaskAll()
      })
    }
  }
}

export function updateAccountGroup( accountGroup:string ) {
  return (dispatch:Function,getState:Function)=>{
    let state:IAccountState = getState();
    let accountArray = state.accountTable.accountList;
    let selectedAccountIds:Array<string> = [];
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    accountArray.forEach( a=>{
      if ( a.selected ) {
        selectedAccountIds.push( a.login )
      }
    } )
    LoadingMask.maskAll()
    return HttpClient.doPost( '/v1/account/manage/updateAccountGroup', {
      vendor: VenderHelper.getVender(),
      group: accountGroup,
      accounts:selectedAccountIds
    },extraHeaders);
  }
}

export function initLeverage() {
  return ( dispatch:Function, getState:Function )=>{
    let state:IAccountState = getState();
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    if ( state.editAccount.accountGroupArray.length === 0 ) {
      LoadingMask.maskAll();
      HttpClient.doGet( '/v1/tenants/metadata/field/option/leverage',{},extraHeaders ).then(res=>{ 
        if ( res.result && res.data ) {
          dispatch({
              type:ActionTypes.ReceiveLeverage,
              list:res.data
          })
        }
        LoadingMask.unmaskAll()
      }).catch(error => {
        
        LoadingMask.unmaskAll()
      })
    }
  }
}


export function updateLeverage( leverage:string,sendEmail:boolean ) {
  return (dispatch:Function,getState:Function)=>{
    let state:IAccountState = getState();
    let accountArray = state.accountTable.accountList;
    let selectedAccountIds:Array<string> = [];
    let extraHeaders = Object.assign( {}, {
      "x-api-vendor": VenderHelper.getVender(),
      "x-api-serverid":parseInt(ServerHelper.getServer()),
    } )
    accountArray.forEach( a=>{
      if ( a.selected ) {
        selectedAccountIds.push( a.login )
      }
    } )
    LoadingMask.maskAll()
    return HttpClient.doPost( '/v1/account/manage/updateLeverage', {
      leverage: leverage,
      accounts:selectedAccountIds
    },extraHeaders );
  }
}
