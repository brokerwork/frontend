import { TableColumnOpt } from 'fooui';
import ActionTypes from '../actions/actiontypes';
// model
import {BWUserDTO} from '../model/user';
// moment
import * as moment from 'moment';
// constants
import { Constants } from '../constants';
// enums
import {UserSearchType} from '../enums/userSearchType';
import {UserQueryType} from '../enums/userQueryType';

interface UserMgmtState {
  userTableColOptions:Array<TableColumnOpt>,
  userTableAllColOptions: Array<TableColumnOpt>,
  userList: Array<any>,
  showBatchTools: boolean,
  userSelectedCount: number,
  userToBeUpdate: BWUserDTO & {originalEmail?:string},
  totalPageNo: number,
  total: number,
  currentPageNo: number,
  pageSize: number,
  isEditCardHide: boolean,
  isAddCardHide: boolean,
  startDate: moment.Moment,
  endDate: moment.Moment,
  userSearchType: string,
  userHierarchy: string,
  tenantId: string,
  auUsernameErrorMsg: string,
  auEmailErrorMsg:string,
  auReakErrorMsg:string,
  auRoleErrorMsg: string,
  auPwdErrorMsg:string,
  euUsernameErrorMsg:string,
  euEmailErrorMsg:string,
  euReakErrorMsg:string,
  euPwdErrorMsg:string,
  queryContent: string,
  queryType: string,
  sortType: string,
  orderType: boolean
  selectRole:Object,
  simplyRoleList:Object,
  upWard: Object,
  reakRuleDetail:Object,
  selectHierarchy:Object,
  selectLevelCount:Object,
  simpleUserList:Object,
  slectServer:Object,
  loginList: any,
  showAllChecked:boolean,
  passwordStrength: string,
  simpleRoleList: Object
}

let initState:UserMgmtState = {
  userTableColOptions:[],
  userTableAllColOptions:[],
  userList:[],
  showBatchTools: false,
  userSelectedCount: 0,
  userToBeUpdate: new BWUserDTO({}),
  totalPageNo: 0,
  total: 0,
  currentPageNo: 1,
  pageSize: 10,
  isEditCardHide:false,
  isAddCardHide:false,
  startDate: moment('2000-01-01', 'YYYY-MM-DD'),
  endDate: moment().endOf('days'),
  tenantId: 'tenantId',
  auUsernameErrorMsg: '',
  auEmailErrorMsg: '',
  auPwdErrorMsg: '',
  auRoleErrorMsg: '',
  euUsernameErrorMsg: '',
  euEmailErrorMsg: '',
  euReakErrorMsg:'',
  euPwdErrorMsg: '',
  queryContent: '',
  queryType: UserQueryType.ENTITY_NO,
  sortType: 'createDate',
  orderType: true,
  userSearchType: UserSearchType.AllSee, // 按时没有用，
  userHierarchy:'',
  selectRole: [],
  upWard:[],
  reakRuleDetail:[],
  selectHierarchy:[],
  selectLevelCount:[],
  simpleUserList:[],
  slectServer: [],
  loginList:[],
  showAllChecked:false,
  passwordStrength: '',
  simpleRoleList: []
};

export default function app( state=initState, action:any ) {
  switch( action.type ) {
    case ActionTypes.FETCH_USER_TABLE_COLUMN: {
      return Object.assign( {}, state, {
        userTableColOptions: action.userTableColOptions,
        userTableAllColOptions: action.userTableAllColOptions
      } )
    }
    case ActionTypes.RECEIVE_USER: {
      let userRawList = action.result.list;
      let userList:Array<BWUserDTO> = [];
      userRawList.forEach((item:any)=>{
          userList.push( new BWUserDTO( item ) );
      })
      return Object.assign( {}, state, {
        userList: userList,
        currentPageNo: action.currentPageNo,
        totalPageNo: action.result.pages,
        total: action.result.total
      } )
    }
    case ActionTypes.CHANGE_USER_TABLE_COLUMN: {
      return Object.assign( {}, state, {
        userTableColOptions: action.userTableColOptions
      } )
    }
    case ActionTypes.TOGGLE_USER_SELECT: {
      let hasSelectedCount = 0;
      let newUserList = state.userList.map( user=>{
        if ( user.id === action.id ) {
          if (action.selected) hasSelectedCount++
          return Object.assign( {}, user, {
            selected: action.selected
          } )
        } else {
          if (user.selected) hasSelectedCount++
          return user;
        }
      } );
      return Object.assign( {}, state, {
        userList: newUserList,
        showBatchTools: hasSelectedCount > 0 ? true : false,
        userSelectedCount: hasSelectedCount
      } );
    }
    case ActionTypes.TOGGLE_ALL_USER_SELECT: {
      let newUserList = state.userList.map( user=>{
        return Object.assign( {}, user, {
          selected: action.selected
        } )
      } )
      if(!state.showAllChecked){
          return Object.assign( {}, state, {
            userList: newUserList,
            showBatchTools: action.selected,
            userSelectedCount: 0
          } );
      }else{
        return Object.assign( {}, state, {
            userList: newUserList,
            showBatchTools: action.selected,
            userSelectedCount: state.userList.length
          } );
      }
      
    }
    case ActionTypes.REMOVE_USER_TO_RECYCLE_SUCCESS: {
      return Object.assign( {}, state, {
        showBatchTools: false
      } )
    }
    case ActionTypes.REMOVE_USER_TO_NEW_PARENT: {
      return Object.assign( {}, state, {
        showBatchTools: false
      } )
    }
    case ActionTypes.SHOW_USER_EDITOR: {
      let id = action.id;
      let bwUser = state.userList.find( (u:BWUserDTO)=>{
          return u.id === id
      } )
      return Object.assign( {}, state, {
        userToBeUpdate: Object.assign( {
          originalEmail: bwUser.email
        }, bwUser )
      } )
    }
    case ActionTypes.SHOW_AU_EMAIL_ERROR_MSG: {
      return Object.assign({}, state, {
        auEmailErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_AU_USERNAME_ERROR_MSG: {
      return Object.assign({}, state, {
        auUsernameErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_AU_ROLE_ERROR_MSG: {
      return Object.assign({}, state, {
        auRoleErrorMsg: action.msg
      })
    }
    case ActionTypes.CHANGE_USER_TO_BE_UPDATE: {
      let newUserToBeUpdate = Object.assign( {}, state.userToBeUpdate, {
        [action.key]: action.value
      } )
      return Object.assign( {}, state, {
        userToBeUpdate: newUserToBeUpdate
      })
    }
    case ActionTypes.SHOW_AU_PWD_ERROR_MSG: {
      return Object.assign({}, state, {
        auPwdErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_EU_EMAIL_ERROR_MSG: {
      return Object.assign({}, state, {
        euEmailErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_EU_REAK_ERROR_MSG: {
      return Object.assign({}, state, {
        euReakErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_EU_USERNAME_ERROR_MSG: {
      return Object.assign({}, state, {
        euUsernameErrorMsg: action.msg
      } );
    }
    case ActionTypes.SHOW_EU_PWD_ERROR_MSG: {
      return Object.assign({}, state, {
        euPwdErrorMsg: action.msg
      } );
    }
    case ActionTypes.CHANGE_PAGE_SIZE: {
      return Object.assign( {}, state, {
        pageSize: action.pageSize
      } )
    }
    case ActionTypes.CHANGE_CURRENT_PAGE_NO: {
      return Object.assign( {}, state, {
        currentPageNo: action.currentPageNo
      } )
    }
    case ActionTypes.HIDE_EDIT_CARD: {
      return Object.assign( {}, state, {
        isEditCardHide: action.isEditCardHide
      } )
    }
    case ActionTypes.HIDE_ADD_CARD: {
      return Object.assign( {}, state, {
        isAddCardHide: action.isAddCardHide
      } )
    }
    case ActionTypes.CHANGE_SHOW_ALL_CHECKED: {
      return Object.assign( {}, state, {
        showAllChecked: action.showAllChecked,
      } )
    }
    case ActionTypes.CHANGE_DATE_RANGE: {

      let n = Object.assign( {}, state)
      n.startDate = action.startDate;
      n.endDate = action.endDate;
 
      return n;
    }
    case ActionTypes.CHANGE_USER_SEARCH_TYPE: {
      return Object.assign( {}, state, {
        userSearchType: action.userSearchType
      })
    }
    case ActionTypes.CHANGE_USER_SEARCH_HIERARCHY: {
      return Object.assign( {}, state, {
        userHierarchy: action.userHierarchy
      })
    }
    case ActionTypes.CHANGE_QUERY_CONTENT: {
      return Object.assign( {}, state, {
        queryContent: action.queryContent
      })
    }
    case ActionTypes.CHANGE_QUERY_TYPE: {
      return Object.assign( {}, state, {
        queryType: action.queryType
      })
    }
    case ActionTypes.CHANGE_SORT_TYPE: {
      return Object.assign( {}, state, {
        sortType: action.sortType
      })
    }
    case ActionTypes.CHANGE_ORDER_TYPE: {
      return Object.assign( {}, state, {
        orderType: action.orderType
      })
    }
    case ActionTypes.CLEAR_AU_ERROR_MSG: {
      return Object.assign( {}, state, {
        auUsernameErrorMsg: '',
        auEmailErrorMsg: '',
        auPwdErrorMsg: '',
        auRoleErrorMsg:''
      } );
    }
    case ActionTypes.CLEAR_EU_ERROR_MSG: {
      return Object.assign({},state,{
        euUsernameErrorMsg: '',
        euEmailErrorMsg: '',
        euPwdErrorMsg: '',
        euReakErrorMsg: '',
      })
    }
    case ActionTypes.SELECT_ROLE: {
        var roles = action.payload;
        return Object.assign({},state,{selectRole:roles})
    }
    case ActionTypes.SIMPLE_ROLE_LIST: {
        var roles = action.payload;
        return Object.assign({},state,{simpleRoleList:roles})
    }
    case ActionTypes.SHOW_UPWARD_RETURN: {
        var upward = action.payload;
        return Object.assign({},state,{upWard:upward})
    }
    case ActionTypes.SHOW_REAK_RULE_DETAIL: {
        var reakruledetail = action.payload;
        if(reakruledetail.length === 0){
          reakruledetail[0] = {"name" : "本条规则暂无"};
        }
        return Object.assign({},state,{reakRuleDetail:reakruledetail})
    }
    case ActionTypes.SELECT_HIERARCHY: {
        var hierarchys = action.payload;
        return Object.assign({},state,{selectHierarchy:hierarchys})
    }
    case ActionTypes.SELECT_LEVLECOUNT: {
        var levelcounts = action.payload;
        return Object.assign({},state,{selectLevelCount:levelcounts})
    }
    case ActionTypes.GET_SERVERS: {
        var serverlist = action.payload;
        return Object.assign({},state,{slectServer:serverlist})
    }
    case ActionTypes.GET_PASSWORD_STRENGTH: {
        var passwordIsStrong = action.payload;
        return Object.assign({},state,{passwordStrength:passwordIsStrong})
    }
    case ActionTypes.FUZY_LOGIN: {
        var searchresultArr = action.payload;
        return Object.assign({},state,{loginList:searchresultArr})
    }
    case ActionTypes.SIMPLE_USERLIST: {
        var simpleuserlist = action.payload;
        return Object.assign({},state,{simpleUserList:simpleuserlist})
    }
    default: {
      return state;
    }
  }
}

export { UserMgmtState };
