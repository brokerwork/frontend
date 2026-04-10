import ActionTypes from '../actions/actionTypes';
// model
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import * as moment from 'moment';
import SeverList from '../model/severList';

interface IAccountTableState {
  showBatchTools: boolean,
  accountList: Array<Account>,
  selectSever: Array<SeverList>,
  selectedCount: number,
  startDate: moment.Moment,
  endDate: moment.Moment,
  queryContent: string,
  userSearchType: string,
  currentPageNo: number,
  pageSize: number,
  total: number,
  totalPageNo: number
}

let accountDummyData:Array<Account> = [];
for (let i = 0; i < 10; i++ ) {
  accountDummyData.push( new Account({id:i+'124837636',account:'acc'+i+'124837636'}) )
}

let initState:IAccountTableState = {
  showBatchTools: false,
  accountList: [],//accountDummyData,
  selectedCount: 0,
  startDate: moment('2000-01-01', 'YYYY-MM-DD'),
  endDate: moment().endOf('day'),
  queryContent: '',
  userSearchType: 'all',
  currentPageNo: 1,
  pageSize: 10,
  total: 0,
  totalPageNo: 0,
  selectSever:[]
}

export function AccountTableReducer( state=initState, action:any ):IAccountTableState {
  switch ( action.type ) {
    case ActionTypes.ChangeDataRange: {
      return Object.assign( {}, state, {
        startDate: action.startDate,
        endDate: action.endDate
      } );
    }
    case ActionTypes.ChangeUserSearchType: {
      return Object.assign( {}, state, {
        userSearchType: action.userSearchType
      } )
    }
    case ActionTypes.ChangePageSize: {
      return Object.assign( {}, state, {
        pageSize: action.pageSize
      } )
    }
    case ActionTypes.SelectAllAccount: {
      return Object.assign( {}, state, {
        accountList: state.accountList.map( a=>{
          a.selected = action.selected;
          return new Account( a )
        } ),
        showBatchTools: action.selected,
        selectedCount: state.accountList.length
      } )
    }
    case ActionTypes.SelectAccount: {
      let hasSelected = false;
      let selectedCount = 0;
      let newAccountList = state.accountList.map( a=> {
        if ( a.login === action.id ) {
          a.selected = action.selected
        }
        if ( a.selected ) {
          selectedCount ++;
          hasSelected = true;
        }
        return new Account( a );
      } )

      return Object.assign( {}, state, {
        showBatchTools: hasSelected,
        accountList: newAccountList,
        selectedCount: selectedCount
      } )
    }
    case ActionTypes.ReceiveAccount: {
      let accountList:Array<Account> = [];
      action.list.forEach( (rawData:any)=>{
        accountList.push( new Account(rawData) );
      } )
      return Object.assign( {}, state, {
        accountList: accountList,
        total: action.total,
        currentPageNo: action.currentPageNo,
        pageSize: action.pageSize,
        totalPageNo: action.totalPageNo
      }　)
    }
    case ActionTypes.SELECTSEVER: {
        let severs = action.list;
        let severList:Array<SeverList> = [];
        severs.forEach((item:any)=>{
          severList.push( new SeverList({label:item.desc,value:item.serverId}) );
      })
        return Object.assign({},state,{selectSever:severList})
    }
    default:
      return state;
  }
}

export { IAccountTableState };
