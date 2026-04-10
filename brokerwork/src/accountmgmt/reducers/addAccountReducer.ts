import ActionTypes from '../actions/actionTypes';
import AccountGroup from '../model/accountGroup';
import UserBelongTo from '../model/userBelongTo';
import Leverage from '../model/leverage';
import Nationality from '../model/nationality';

interface IAddAccountState {
  firstNameErrorMsg: string, // 名的错误信息
  lastNameErrorMsg: string, // 姓的错误信息
  isFirstNameError: boolean,
  isLastNameError: boolean,
  accountGroupErrorMsg: string,
  leverageErrorMsg: string,
  accountGroupArray: Array<AccountGroup>,
  userBelongToArray: Array<UserBelongTo>,
  leverageArray: Array<Leverage>,
  nationalityArray: Array<Nationality>,
  enableRadioChecked: number,
  readOnlyRadioChecked: number,
  accountGroupInfo: Object[]
}

let initState: IAddAccountState = {
  firstNameErrorMsg: '',
  lastNameErrorMsg: '',
  isFirstNameError: false,
  isLastNameError: false,
  accountGroupErrorMsg: '',
  leverageErrorMsg: '',
  accountGroupArray: [],
  userBelongToArray: [],
  leverageArray: [],
  nationalityArray: [],
  enableRadioChecked: 1,
  readOnlyRadioChecked: 1,
  accountGroupInfo: [],
}

export function AddAccountReducer(state = initState, action: any): IAddAccountState {
  switch (action.type) {
    case ActionTypes.ReceiveNationality: {
      let newArray: Array<Nationality> = [];
      action.list.forEach((d: any) => {
        let __obj = new Nationality(d);
        __obj['label'] = __obj.value;
        __obj['value'] = __obj.id;
        newArray.push(__obj);
      })
      return Object.assign({}, state, {
        nationalityArray: newArray
      })
    }
    case ActionTypes.CheckNotReadOnly: {
      return Object.assign({}, state, {
        readOnlyRadioChecked: 1
      })
    }
    case ActionTypes.CheckReadOnly: {
      return Object.assign({}, state, {
        readOnlyRadioChecked: 0
      })
    }
    case ActionTypes.CheckDisable: {
      return Object.assign({}, state, {
        enableRadioChecked: 0
      })
    }
    case ActionTypes.CheckEnable: {
      return Object.assign({}, state, {
        enableRadioChecked: 1
      })
    }
    case ActionTypes.ReceiveLeverage: {
      let newArray: Array<Leverage> = [];
      action.list.forEach((v: any) => {
        newArray.push(new Leverage({
          zhCN: v,
          cmId: v
        }))
      })
      return Object.assign({}, state, {
        leverageArray: newArray
      })
    }
    case ActionTypes.ReceiveUserBelongTo: {
      let newArray: Array<UserBelongTo> = [];
      action.list.forEach((o: any) => {
        let __obj = new UserBelongTo(o);
        __obj['value'] = __obj.id;
        __obj['label'] = __obj.entityNo + " : " + __obj.name;
        newArray.push(__obj);
      })
      return Object.assign({}, state, {
        userBelongToArray: newArray
      })
    }
    case ActionTypes.ReceiveAccountGroup: {
      let newArray: any = [];
      action.list.forEach((v: any) => {
        let __obj = new AccountGroup({
          zhCN: v,
          cmId: v
        });
        __obj['value'] = __obj.cmId;
        __obj['label'] = __obj.zhCN;
        newArray.push(__obj);
      });
      return Object.assign({}, state, {
        accountGroupArray: newArray
      })
    }
    case ActionTypes.ShowFirstNameError: {
      return Object.assign({}, state, {
        firstNameErrorMsg: action.msg,
        isFirstNameError: true
      })
    }
    case ActionTypes.HideFirstNameError: {
      return Object.assign({}, state, {
        isFirstNameError: false
      })
    }
    case ActionTypes.ShowLastNameError: {
      return Object.assign({}, state, {
        lastNameErrorMsg: action.msg,
        isLastNameError: true
      })
    }
    case ActionTypes.HideLastNameError: {
      return Object.assign({}, state, {
        isLastNameError: false
      })
    }
    case ActionTypes.ShowAccountGroupError: {
      return Object.assign({}, state, {
        accountGroupErrorMsg: action.msg
      })
    }
    case ActionTypes.HideAccountGroupError: {
      return Object.assign({}, state, {
        accountGroupErrorMsg: ''
      })
    }
    case ActionTypes.ShowLeverageError: {
      return Object.assign({}, state, {
        leverageErrorMsg: action.msg
      })
    }
    case ActionTypes.HideLeverageError: {
      return Object.assign({}, state, {
        leverageErrorMsg: ''
      })
    }
    case ActionTypes.FETCH_ACCOUNT_GROUPS: {
      let newArray: any = [];
      action.list.forEach((v: any) => {
        newArray.push({
          value: v.id,
          label: v.groupName
        });
      });
      return Object.assign({}, state, {
        accountGroupInfo: newArray
      })
    }
    default:
      return state;
  }
}

export { IAddAccountState };
