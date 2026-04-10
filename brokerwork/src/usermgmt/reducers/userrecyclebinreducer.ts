import { BWUserDTO } from '../model/user';
import ActionTypes from '../actions/actiontypes';

interface UserRcycleBinState {
    userList: Array<BWUserDTO>,
    totalPageNo: number,
    total: number,
    currentPageNo: number,
    pageSize: number,
    queryContent: string
}

let initialState:UserRcycleBinState = {
    userList: [],
    totalPageNo: 0,
    total: 0,
    currentPageNo: 0,
    pageSize: 10,
    queryContent: ''
}

let dummyData:Array<any> = [
  {
    id: '1',
    email: 'jerry@lwork.com'
  },
  {
    id: '2',
    email: 'jerry@lwork.com'
  }
]

export default function binReducer(state:UserRcycleBinState=initialState, action:any){
    switch(action.type){
        case ActionTypes.RECEIVE_USER_IN_RECYCLE: {
            let userRawList = action.result.list;
            // let userRawList = dummyData;
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
        case ActionTypes.CHANGE_PAGE_SIZE_IN_RECYCLE_BIN: {
            return Object.assign( {}, state, {
                pageSize: action.pageSize
            } )
        }
        case ActionTypes.TOGGLE_USER_SELECT_IN_RECYCLE_BIN: {
            let newUserList = state.userList.map( user=>{
                if ( user.id === action.id ) {
                    return Object.assign( {}, user, {
                        selected: action.selected
                    } )
                } else {
                    return user;
                }
            } );
            return Object.assign( {}, state, {
                userList: newUserList
            } );
        }
        case ActionTypes.TOGGLE_ALL_USER_SELECT_IN_RECYCLE_BIN: {
            let newUserList = state.userList.map( user=>{
                return Object.assign( {}, user, {
                selected: action.selected
                } )
            } )
            return Object.assign( {}, state, {
                userList: newUserList
            } );
        }
        case ActionTypes.CHANGE_QUERY_CONTENT_IN_RECYCLE_BIN: {
            return Object.assign( {}, state, {
                queryContent: action.queryContent
            } )
        }
        default: {
            return state;
        }
    }
}

export { UserRcycleBinState };
