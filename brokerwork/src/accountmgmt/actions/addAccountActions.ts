import ActionTypes from './actionTypes';
import { HttpClient } from '../../http/httpclient';
import { LoadingMask, Message } from 'fooui';
import { I18nLoader } from '../../i18n/loader';
//action
import { fetchAccount } from './accountTableActions';
import { IAccountState } from '../store/mt4store';
import ServerHelper from '../utils/serverHelper';
import venderHelper from '../utils/venderHelper';

export function showFirstNameError(msg: string) {
  return {
    type: ActionTypes.ShowFirstNameError,
    msg: msg
  }
}

export function hideFirstNameError() {
  return {
    type: ActionTypes.HideFirstNameError
  }
}


export function showLastNameError(msg: string) {
  return {
    type: ActionTypes.ShowLastNameError,
    msg: msg
  }
}

export function hideLastNameError() {
  return {
    type: ActionTypes.HideLastNameError
  }
}

export function showAccountGroupError(msg: string) {
  return {
    type: ActionTypes.ShowAccountGroupError,
    msg: msg
  }
}

export function hideAccountGroupError() {
  return {
    type: ActionTypes.HideAccountGroupError
  }
}

export function showLeverageError(msg: string) {
  return {
    type: ActionTypes.ShowLeverageError,
    msg: msg
  }
}

export function hideLeverageError() {
  return {
    type: ActionTypes.HideLeverageError
  }
}

export function addAccount(newAccountData: any) {
  return (dispatch: Function) => {
    LoadingMask.maskAll();
    HttpClient.doPost('/v1/account/manage/open', newAccountData, {
      'x-api-serverid': ServerHelper.getServer(),
      'x-api-vendor': venderHelper.getVender()
    }).then(res => {
      if (res.result) {
        Message.success('添加用户成功');
        dispatch(fetchAccount())
      } else {
        Message.error(I18nLoader.getErrorText(res.mcode));
      }
      LoadingMask.unmaskAll()
    }).catch(() => {
      LoadingMask.unmaskAll()
    })
  }
}

export function initAddAccountCard() {
  return (dispatch: Function, getState: Function) => {
    let state: IAccountState = getState();
    // if (state.addAccount.accountGroupArray.length >0&&
    //     state.addAccount.userBelongToArray.length>0 &&
    //     state.addAccount.leverageArray.length>0 && state.addAccount.nationalityArray.length > 0) {
    //   return;
    // }

    let promiseChainArray: Array<any> = [];
    let actionTypesArray: any = [];
    // if ( state.addAccount.accountGroupArray.length === 0 ) {
    promiseChainArray.push(HttpClient.doGet('/v1/account/dropdown/groups', {}, {
      'x-api-serverid': ServerHelper.getServer(),
      'x-api-vendor': venderHelper.getVender()
    }))
    actionTypesArray.push(ActionTypes.ReceiveAccountGroup)

    promiseChainArray.push(HttpClient.doGet('/v1/account/manage/userGroup/info'))
    actionTypesArray.push(ActionTypes.FETCH_ACCOUNT_GROUPS)
    // }
    // if ( state.addAccount.userBelongToArray.length === 0 ) {
    promiseChainArray.push(HttpClient.doPost('/v1/user/listAll', {
      endDate: 0,
      orderDesc: false,
      pageNo: 0,
      queryContent: null,
      startDate: 0,
      tenantId: null,
      userSearchType: null
    }))
    actionTypesArray.push(ActionTypes.ReceiveUserBelongTo)
    // }
    // if ( state.addAccount.leverageArray.length === 0 ) {
    promiseChainArray.push(HttpClient.doGet('/v1/tenants/metadata/field/option/leverage', {}, {
      'x-api-serverid': ServerHelper.getServer(),
      'x-api-vendor': venderHelper.getVender()
    }))
    actionTypesArray.push(ActionTypes.ReceiveLeverage)
    // }
    // if ( state.addAccount.nationalityArray.length === 0 ) {
    promiseChainArray.push(HttpClient.doPost('/v1/static/country_city?parent_id=0&lang=zhCN'))
    actionTypesArray.push(ActionTypes.ReceiveNationality)
    // }

    LoadingMask.maskAll();
    Promise.all(promiseChainArray).then(resArray => {
      for (let i = 0; i < resArray.length; i++) {
        if (resArray[i].result) {
          dispatch({
            type: actionTypesArray[i],
            list: resArray[i].data
          })
        } else {
          throw new Error('添加账户初始化失败[' + actionTypesArray[i] + ']')
        }
      }
      LoadingMask.unmaskAll()
    }).catch(error => {

      LoadingMask.unmaskAll()
    })
  }
}
