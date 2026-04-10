var uuid = 0x2B845;
import {UserHelper} from './userHelper';

let utils = {
    getValue(obj:any, key:string):any{
        if (obj == null || obj[key] == null){
            return null;
        }
        return obj[key];
    },
    nextUid(){
        return uuid++;
    },
    // getOperationPrivilege(key:string):number{
    //     var privileges = JSON.parse( sessionStorage.getItem(UserHelper.UI_OPERATION_PRIVILEGE_LIST) );
    //     console.log(privileges);
    //     let flag:number = 0;
    //     var isPrivilegeOperationKeyFound = false;
    //     privileges.forEach(obj=>{
    //         if (obj.entityNo === key){
    //             flag = obj.flag;
    //             isPrivilegeOperationKeyFound = true;
    //         }
    //     })
    //     if (!isPrivilegeOperationKeyFound) {
    //         throw new Error(`Can not found operation privilege by key: ${key}`);
    //     }
    //     return flag;
    // },
    linkValue(str:any){
        if (location.href.indexOf('localhost') != -1){
            return str.replace(/(#.*$)/, function(match:any){
                return '?$Path=/dev' + match;
            })
        }
        return str;
    }
}

export {utils};