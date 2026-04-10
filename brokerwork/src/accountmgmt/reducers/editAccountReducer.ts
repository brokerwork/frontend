import ActionTypes from '../actions/actionTypes';
// model
import {
  AccountDTO as Account, ExternalInfo
} from '../model/account';
import AccountGroup from '../model/accountGroup';
import UserBelongTo from '../model/userBelongTo';
import Customer from '../model/customer';
import FinInfo from '../model/finInfo';
import CertInfo from '../model/certInfo';
import DropdownOption from '../model/dropdownOption';
import { AccountEditorTabKeys } from '../components/editAccountCard';

interface IEditAccountState {
  currentAccountId: string,
  currentAccountFinInfo: FinInfo
  currentAccountCertInfo: CertInfo
  showEditor: boolean,
  workAgeArray: Array<string>
  accountGroupArray: Array<AccountGroup>,
  userBelongToArray: Array<UserBelongTo>
  assetsRangeArray: Array<DropdownOption>,
  investmentYearArray: Array<DropdownOption>,
  knowledgeLevelArray: Array<DropdownOption>,
  incomeSourceArray: Array<DropdownOption>,
  investmentExperienceArray: Array<DropdownOption>,
  customerArray: Array<Customer>,
  currentTabEventKey: AccountEditorTabKeys,
  identityTypeArray: Array<DropdownOption>,
  addressTypeArray: Array<DropdownOption>,
  certificatesFields: Object[],
  basicFields: Object[],
  financeFields: Object[],
  accountFields: Object[],
  certificatesData: Object,
  basicData: Object,
  financeData: Object,
  accountData: Object,
  countryCode: Object[],
}

let initState: IEditAccountState = {
  currentAccountId: undefined,
  showEditor: false,
  workAgeArray: [],
  accountGroupArray: [],
  userBelongToArray: [],
  customerArray: [],
  currentAccountFinInfo: new FinInfo({}),
  currentAccountCertInfo: new CertInfo({}),
  assetsRangeArray: [],
  investmentYearArray: [],
  knowledgeLevelArray: [],
  incomeSourceArray: [],
  investmentExperienceArray: [],
  currentTabEventKey: AccountEditorTabKeys.BaseInfo,
  identityTypeArray: [],
  addressTypeArray: [],
  certificatesFields: [],
  basicFields: [],
  financeFields: [],
  accountFields: [],
  certificatesData: {},
  basicData: {},
  financeData: {},
  accountData: {},
  countryCode: [],
}

export function EditAccountReducer( state=initState, action:any ):IEditAccountState {
  switch ( action.type ) {
    case ActionTypes.FETCH_CERTIFICATES_FIELDS:
      return Object.assign({}, state, {
        certificatesFields: action.payload
      });
    case ActionTypes.FETCH_BASIC_FIELDS:
      return Object.assign({}, state, {
        basicFields: action.payload
      });
    case ActionTypes.FETCH_FINANCE_FIELDS:
      return Object.assign({}, state, {
        financeFields: action.payload
      });
    case ActionTypes.FETCH_ACCOUNT_FIELDS:
      return Object.assign({}, state, {
        accountFields: action.payload
      });
    case ActionTypes.InitCerInfo: {
      let initialization = action.initialization;
      let newState: any = {};
      if (initialization.identityTypeArray) {
        newState.identityTypeArray = initialization.identityTypeArray.map((i: any) => new DropdownOption(i))
      }
      if (initialization.addressTypeArray) {
        newState.addressTypeArray = initialization.addressTypeArray.map((a: any) => new DropdownOption(a))
      }
      if (initialization.certInfo) {
        newState.currentAccountCertInfo = new CertInfo(initialization.certInfo)
      }
      return Object.assign({}, state, newState);
    }
    case ActionTypes.ChangeAccountEditorCardTab: {
      return Object.assign({}, state, {
        currentTabEventKey: action.eventKey
      })
    }
    case ActionTypes.InitFinInfo: {
      let init: any = action.initialization;
      let newState: any = {};
      if (init.assetsRangeData) {
        newState.assetsRangeArray = init.assetsRangeData.map((d: any) => new DropdownOption(d))
      }
      if (init.assetsRangeData) {
        newState.investmentYearArray = init.investmentYearData.map((d: any) => new DropdownOption(d))
      }
      if (init.assetsRangeData) {
        newState.knowledgeLevelArray = init.knowledgeLevelData.map((d: any) => new DropdownOption(d))
      }
      if (init.assetsRangeData) {
        newState.incomeSourceArray = init.incomeSourceData.map((d: any) => new DropdownOption(d))
      }
      if (init.assetsRangeData) {
        newState.investmentExperienceArray = init.investmentExperienceData.map((d: any) => new DropdownOption(d))
      }
      return Object.assign({}, state, newState);
    }
    case ActionTypes.ReceiveFinInfo: {
      return Object.assign({}, state, {
        currentAccountFinInfo: new FinInfo(action.data)
      })
    }
    case ActionTypes.HideEditAccountCard: {
      return Object.assign({}, state, {
        showEditor: false
      }　)
    }
    case ActionTypes.ReceiveWorkAge: {
      let newArray: any = [];
      action.list.forEach((d: any) => {
        newArray.push(d.zhCN)
      });
      return Object.assign({}, state, {
        workAgeArray: newArray
      })
    }
    case ActionTypes.EditAccount: {
      return Object.assign({}, state, {
        currentAccountId: action.id,
        showEditor: true,
        currentTabEventKey: AccountEditorTabKeys.BaseInfo
      })
    }
    case ActionTypes.HideAccountEditor: {
      return Object.assign({}, state, {
        showEditor: false
      }　)
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
    case ActionTypes.FETCH_CUSTOMERS: {
      let newArray: Array<Customer> = [];
      action.list.forEach((o: any) => {
        newArray.push(new Customer(o))
      })
      return Object.assign({}, state, {
        customerArray: newArray
      })
    }
    case ActionTypes.ReceiveAccountGroup: {
      let newArray: any = [];
      action.list.forEach((v: any) => {
        newArray.push(new AccountGroup({
          zhCN: v,
          cmId: v
        }))
      });
      return Object.assign({}, state, {
        accountGroupArray: newArray
      })
    }

    case ActionTypes.FETCH_PHONE_COUNTRY_CODE:
      return Object.assign({}, state, {
        countryCode: action.payload
      })
    default:
      return state;
  }
}

export { IEditAccountState };
