import { UserTableColumnOptions } from '../components/usertablecolumnoptions';
import { TableColumnOpt, LoadingMask, Message } from 'fooui';
import ActionTypes from './actiontypes';
import PrivilegeHelper from '../../common/privilegeHelper';
// http
import { HttpClient } from '../../http/httpclient';
// store
import { UserAppState } from '../store/usermgmtstore';
// constants
import {Constants} from '../constants'
import {I18nLoader} from '../../i18n/loader';

let allColumnsData:Array<string> = [
    'id', 'username', 'roleId',
    'parent', 'memberCount','levelId', 
    'email', 'phone', 'location', 'active',
    'additionalCol2', 'additionalCol3', 'additionalCol4'
];
let tableColumnsData:Array<string> = [
 'active' 
];

export function changeUserSearchType( type:string ) {
    return {
        type: ActionTypes.CHANGE_USER_SEARCH_TYPE,
        userSearchType: type
    }
}

export function changeUserHierarchy( hierarchy:string ) {//批量划转用户拉取当前选中层级的上级用户
    return {
        type: ActionTypes.CHANGE_USER_SEARCH_HIERARCHY,
        userHierarchy: hierarchy
    }
}

export function activeUser( email:string ) {
    return (dispatch:Function) => {
        let USER_DISABLE = PrivilegeHelper.getHavePrivilege("USER_DISABLE");
        if (!USER_DISABLE){
                Message.error( "您没有激活／禁用用户权限！" );
        }else{
             LoadingMask.maskAll();
             HttpClient.doPost( '/v1/user/' + email + '/activate').
                then( res=>{
                    if ( res.result ) {
                        Message.success( '激活用户成功' );
                        dispatch( {
                            type: ActionTypes.ACTIVE_USER
                        } )
                        dispatch( fetchUser() )
                    } else {
                        Message.error( I18nLoader.getErrorText(res.mcode) );
                    }
                    LoadingMask.unmaskAll();
                });
        }
    }
}

export function lockUser( email:string ) {
    return (dispatch:Function) => {
        let USER_DISABLE = PrivilegeHelper.getHavePrivilege("USER_DISABLE");
        if(!USER_DISABLE){
            Message.error( "您没有激活／禁用用户权限！" );
        }else{
            LoadingMask.maskAll();
            HttpClient.doPost( '/v1/user/' + email + '/lock').
                then( res=>{
                    if ( res.result ) {
                        Message.success( '锁定用户成功' );
                        dispatch( {
                            type: ActionTypes.LOCK_USER
                        } )
                        dispatch( fetchUser() )
                    } else {
                        Message.error( I18nLoader.getErrorText(res.mcode) );
                    }
                    LoadingMask.unmaskAll();
            });
        }
    }
}

export function fetchUserTableColumns() {
  let tableColums:Array<TableColumnOpt> = [];
  tableColumnsData.forEach( key=>{
      if ( UserTableColumnOptions[key] ) {
          tableColums.push( UserTableColumnOptions[key] )
      }
  } );


  return {
    type: ActionTypes.FETCH_USER_TABLE_COLUMN,
    userTableColOptions: tableColums,
    userTableAllColOptions: allColumnsData.map( key=>UserTableColumnOptions[key] )
  }
}

export function changeDateRange( startDate:moment.Moment, endDate:moment.Moment ) {
    return {
        type: ActionTypes.CHANGE_DATE_RANGE,
        startDate: startDate,
        endDate: endDate
    }
}

export function fetchUserInRecycleBin( currentPageNo:number = 1 ) {
    return (dispatch:Function, getState:Function ) => {
        let state:UserAppState = getState();
        let params = {
            pageNo: currentPageNo-1,
            size: state.userRecycleBin.pageSize,
            startDate: state.userMgmt.startDate.valueOf(), // 回收站没有按日期选择? 
            endDate: state.userMgmt.endDate.valueOf(), // 回收站没有按日期选择?
            queryContent: state.userRecycleBin.queryContent,
            tenantId: state.userMgmt.tenantId,
            userSearchType: state.userMgmt.userSearchType // 回收站没有按用户类型选择?
        }
        LoadingMask.maskAll();
        HttpClient.doPost( '/v1/user/list/recycle', params ).
            then( res=>{
                let resultData:any;
                if ( res.result ) {
                    resultData = res.data;
                } else {
                    resultData = []
                }
                dispatch( {
                    type: ActionTypes.RECEIVE_USER_IN_RECYCLE,
                    result: resultData,
                    currentPageNo: currentPageNo
                } );
                LoadingMask.unmaskAll();
            });
    }
}

export function changePageSize( pageSize:number ) {
    return {
        type: ActionTypes.CHANGE_PAGE_SIZE,
        pageSize: pageSize
    }
}
export function changeCurrentPageNo( currentPageNo:number ) {
    return {
        type: ActionTypes.CHANGE_CURRENT_PAGE_NO,
        currentPageNo: currentPageNo
    }
}

export function changeShowAllChecked( showAllChecked:boolean ) {
    return {
        type: ActionTypes.CHANGE_SHOW_ALL_CHECKED,
        showAllChecked: showAllChecked
    }
}

export function changePageSizeInRecycleBin( pageSize:number ) {
    return {
        type: ActionTypes.CHANGE_PAGE_SIZE_IN_RECYCLE_BIN,
        pageSize: pageSize
    }
}

export function fetchUser() {
    return (dispatch:Function, getState:Function ) => {
        let state:UserAppState = getState();
        let params = {
            sortby: state.userMgmt.sortType,
            orderDesc: state.userMgmt.orderType,
            pageNo: state.userMgmt.currentPageNo,
            size: state.userMgmt.pageSize,
            startDate: state.userMgmt.startDate.valueOf(),
            endDate: state.userMgmt.endDate.valueOf(),
            queryContent: state.userMgmt.queryContent,
            queryType: state.userMgmt.queryType,
            tenantId: state.userMgmt.tenantId,
            userSearchType: state.userMgmt.userSearchType
        }
        LoadingMask.maskAll();
        HttpClient.doPost( '/v1/user/list', params ).
            then( res=>{
                let resultData:any;
                if ( res.result && res.data ) {
                    resultData = res.data;
                    dispatch( {
                        type: ActionTypes.RECEIVE_USER,
                        result: resultData,
                        currentPageNo: state.userMgmt.currentPageNo
                    } );
                }
                LoadingMask.unmaskAll();
            });
    }
}

export function addUser( params:{[name:string]:any} ) {
    return (dispatch:Function)=>{
        HttpClient.doPost( '/v1/user/addUser', params ).
            then( res=>{
                if ( res.result ) {
                    Message.success( '添加用户成功' );
                    dispatch( fetchUser() );
                    dispatch( hideAddCard(false) );
                } else {
                    dispatch( hideAddCard(true) );
                    Message.error( I18nLoader.getErrorText(res.mcode) );
                }
            } );
    }
}

export function changeUserTableColumn( columns:Array<TableColumnOpt> ) {
  return {
    type: ActionTypes.CHANGE_USER_TABLE_COLUMN,
    userTableColOptions: columns
  }
}

export function toggleUserSelect( id:any, selected:boolean ) {
    return {
        type: ActionTypes.TOGGLE_USER_SELECT,
        selected: selected,
        id: id
    }
}

export function toggleUserSelectInRecycleBin( id:any, selected:boolean ) {
    return {
        type: ActionTypes.TOGGLE_USER_SELECT_IN_RECYCLE_BIN,
        selected: selected,
        id: id
    }
}



export function toggleAllUserSelect( selected: boolean ) {
    return {
        type: ActionTypes.TOGGLE_ALL_USER_SELECT,
        selected: selected
    }
}

export function toggleAllUserSelectInRecycleBin( selected: boolean ) {
    return {
        type: ActionTypes.TOGGLE_ALL_USER_SELECT_IN_RECYCLE_BIN,
        selected: selected
    }
}

export function showUserEditor( id:string ) {
    return {
        type: ActionTypes.SHOW_USER_EDITOR,
        id: id
    }
}

export function changeUserToBeUpdate( key:any, value:any ) {
    return {
        type: ActionTypes.CHANGE_USER_TO_BE_UPDATE,
        key: key,
        value: value
    }
}

export function updateUser( params:{[name:string]:any} ) {
    return ( dispatch:Function ) => {
        HttpClient.doPost( '/v1/user/updateUser', params ).
            then( res=>{
                if ( res.result ) {
                    Message.success( '保存编辑用户成功' )
                    dispatch( fetchUser());
                    dispatch(hideEditCard(false) );
                } else {
                    dispatch(hideEditCard(true) );
                    Message.error( I18nLoader.getErrorText(res.mcode) );
                }
            } );
    }
}

export function updateUserSuccess() {
    return {
        type: ActionTypes.UPDATE_USER_SUCCESS
    }
}

export function changeQueryContent(v:string) {
    return {
        type: ActionTypes.CHANGE_QUERY_CONTENT,
        queryContent: v
    }
}

export function changeQueryType(v:string){
    return {
        type: ActionTypes.CHANGE_QUERY_TYPE,
        queryType: v
    }
}

export function changeSortType(v:string){
    return {
        type: ActionTypes.CHANGE_SORT_TYPE,
        sortType: v
    }
}

export function changeOrderType(v:string){
    return {
        type: ActionTypes.CHANGE_ORDER_TYPE,
        orderType: v
    }
}

export function changeQueryContentInRecycleBin(v:string) {
    return {
        type: ActionTypes.CHANGE_QUERY_CONTENT_IN_RECYCLE_BIN,
        queryContent: v
    }
}

export function removeUserToRecycle() {
    return ( dispatch:Function, getState:Function )=>{
        LoadingMask.maskAll();
        let state:UserAppState = getState();
        let userList = state.userMgmt.userList;
        let selectedUserIds:Array<string> = [];
        userList.forEach(user => {
            if (user.selected) {
                selectedUserIds.push( user.id );
            }
        });
        HttpClient.doPost( '/v1/user/remove',selectedUserIds).then( res=>{
            if ( res.result ) {
                 Message.success("删除用户成功");
                dispatch( {
                    type: ActionTypes.REMOVE_USER_TO_RECYCLE_SUCCESS
                } )
                dispatch( fetchUser() )
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
                LoadingMask.unmaskAll();
            }
        } )
    }
}

export function massTransfer(parent) {//批量划转
    return ( dispatch:Function, getState:Function )=>{
        LoadingMask.maskAll();
        let state:UserAppState = getState();
        let userList = state.userMgmt.userList;
        let selectedUserIds:Array<string> = [];
        userList.forEach(user => {
            if (user.selected) {
                selectedUserIds.push( user.id );
            }
        });
        HttpClient.doPost( '/v1/user/' + parent + '/updateParentBatch',selectedUserIds).then( res=>{
            if ( res.result ) {
                Message.success( '批量划转成功' );
                dispatch( {
                    type: ActionTypes.REMOVE_USER_TO_NEW_PARENT
                } )
                dispatch( fetchUser() )
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
                LoadingMask.unmaskAll();
            }
        } )
    }
}


export function showAuUsernameErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_AU_USERNAME_ERROR_MSG,
        msg: msg
    }
}

export function showAuPwdErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_AU_PWD_ERROR_MSG,
        msg: msg
    }
}

export function showAuEmailErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_AU_EMAIL_ERROR_MSG,
        msg: msg
    }
}

export function showAuReakErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_AU_REAK_ERROR_MSG,
        msg: msg
    }
}

export function  showAuRoleErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_AU_ROLE_ERROR_MSG,
        msg: msg
    }
}


export function showEuUsernameErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_EU_USERNAME_ERROR_MSG,
        msg: msg
    }
}

export function showEuPwdErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_EU_PWD_ERROR_MSG,
        msg: msg
    }
}

export function showEuReakErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_EU_REAK_ERROR_MSG,
        msg: msg
    }
}

export function showEuEmailErrorMsg( msg?:any ) {
    return {
        type: ActionTypes.SHOW_EU_EMAIL_ERROR_MSG,
        msg: msg
    }
}

export function clearAuErrorMsg() {
    return {
        type: ActionTypes.CLEAR_AU_ERROR_MSG
    }
}

export function clearEuErrorMsg() {
    return {
        type: ActionTypes.CLEAR_EU_ERROR_MSG
    }
}

export function clearUsersInRecycleBin( idList:Array<string> ) {
    return (dispatch:Function)=>{
        HttpClient.doPost( '/v1/user/clear', idList ).then( res=>{
            if ( res.result ) {
                Message.success( '清除用户成功' );
                dispatch( fetchUserInRecycleBin() )
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
                LoadingMask.unmaskAll();
            }
        } )
    }
}

export function revertUser( idList:Array<string> ) {
    return (dispatch:Function)=>{
        LoadingMask.maskAll();
        HttpClient.doPost( '/v1/user/restore', idList ).then( res=>{
            if ( res.result ) {
                Message.success( '还原用户成功' );
                dispatch( fetchUserInRecycleBin() )
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
                LoadingMask.unmaskAll();
            }
        } )
    }
}

export function isEmailExisted( email:string, addOrEdit:string ) {
    return ( dispatch:Function )=>{
        HttpClient.doPost( '/v1/user/exists', {
            key: 'email',
            value: email
        } ).then( res=> {
            if ( res.result ) {
                if ( res.data === true ) {
                    if ( addOrEdit === 'add' ) {
                        dispatch( showAuEmailErrorMsg( '该邮箱已被占用' ) )
                    } else {
                        dispatch( showEuEmailErrorMsg( '该邮箱已被占用' ) )
                    }
                }
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
            }
        } )
    }
}

export function SelectRole(){

   return (dispatch:Function)=>{

       HttpClient.doGet('/v1/roleRight/role/findCurrentSetRole')
           .then(res=>{
               dispatch({
                   type:ActionTypes.SELECT_ROLE,
                   payload:res.data
               });
       })
   }
}

export function SimpleRoleList(){

   return (dispatch:Function)=>{

       HttpClient.doPost('/v1/roleRight/role/list')
           .then(res=>{
               dispatch({
                   type:ActionTypes.SIMPLE_ROLE_LIST,
                   payload:res.data
               });
       })
   }
}

export function SelectHierarchy(){//拉取所有层级

   return (dispatch:Function)=>{

       HttpClient.doGet('/v1/level/list')
           .then(res=>{
               dispatch({
                   type:ActionTypes.SELECT_HIERARCHY,
                   payload:res.data
               });
       })
   }
}
export function SelectLevelCount( levelId:number ){//根据选择层级拉取上级用户
    return (dispatch:Function)=>{

       HttpClient.doGet('/v1/user/list/type',{
           id: levelId,
           type: 1,
           includeParent: true
       })
           .then(res=>{
               dispatch({
                   type:ActionTypes.SELECT_LEVLECOUNT,
                   payload:res.data
               });
       })
   }
   
}

export function GetServer(){//拉取服务器信息
    return (dispatch:Function)=>{
       HttpClient.doGet('/v1/account/dropdown/serverList')
           .then(res=>{
               dispatch({
                   type:ActionTypes.GET_SERVERS,
                   payload:res.data
               });
       })
   }
   
}

export function GetPasswordStrength(){//获取密码强度
    return (dispatch:Function)=>{
       HttpClient.doGet('/v1/user/login/access')
           .then(res=>{
               dispatch({
                   type:ActionTypes.GET_PASSWORD_STRENGTH,
                   payload:res.data.pwdStrength
               });
       })
   }
   
}

export function SimpleUserList(){//上级用户列表根据id翻译
    return (dispatch:Function)=>{

       HttpClient.doPost('/v1/user/listSimpleUser')
           .then(res=>{
               dispatch({
                   type:ActionTypes.SIMPLE_USERLIST,
                   payload:res.data
               });
       })
   }
   
}

export function FuzyLogin( vendor:any, serverId:any, text:string ){//模糊搜索
    return (dispatch:Function)=>{
        if (serverId === undefined){
            Message.error( "请先选择账号服务器");
        }else if(text === "" || text === undefined){
            return undefined
        }else{
            let extraHeaders = {
                 "x-api-vendor": vendor,
                "x-api-serverid":serverId,
            }
            LoadingMask.maskAll();
            HttpClient.doGet( '/v1/account/manage/fuzzy/' + text + '?returnNum=10', {}, extraHeaders) 
                .then(res=>{
                    if(res.data != undefined){
                        dispatch({
                            type:ActionTypes.FUZY_LOGIN,
                            payload:res.data
                        });
                    }
                    else{
                        dispatch({
                            type:ActionTypes.FUZY_LOGIN,
                            payload: "" 
                        });
                    }
                    LoadingMask.unmaskAll();
            })
        }
        
   }
   
}

export function ShowUpwardReturn( levelId:number, parentId: number = 0,userId:number = 0){//向上向下返佣数据
    return (dispatch:Function)=>{
       HttpClient.doGet('/v1/report/user/show/' + levelId +'/' + parentId + '/' + userId)
           .then(res=>{
               if ( res.result ) {
                    dispatch({
                        type:ActionTypes.SHOW_UPWARD_RETURN,
                        payload:res.data
                     });
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
            }
               
       })
   }
   
}

export function hideEditCard( isHide: boolean ) {
    return {
        type: ActionTypes.HIDE_EDIT_CARD,
        isEditCardHide: isHide
    }
}

export function hideAddCard( isHide: boolean ) {
    return {
        type: ActionTypes.HIDE_ADD_CARD,
        isAddCardHide: isHide
    }
}

export function ShowReakRuleDetail( detailId:number ){//展示向上返佣规则
    return (dispatch:Function)=>{

        if(detailId){
            HttpClient.doGet('/v1/report/user/showRuleDetail/'+ detailId)
                .then(res=>{
                     if ( res.result ) {
                        dispatch({
                            type:ActionTypes.SHOW_REAK_RULE_DETAIL,
                            payload:res.data
                        });
                    } else {
                        Message.error( I18nLoader.getErrorText(res.mcode) );
                    }   
            })
        }
   }
   
}


