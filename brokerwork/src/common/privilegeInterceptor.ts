import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import PrivilegeHelper from './privilegeHelper'
import { Message } from 'fooui';

//获取用户权限列表
function loadPrivilegeList(){
    var keyarr = [];
     for (var i = 0, len = sessionStorage.length; i < len; i++){
        var key = sessionStorage.key(i);
        keyarr[i] = key;     
    }
    // 已经接收过用户权限，则不再请求
    if (sessionStorage.getItem('USER_RIGHT')) {
        return Promise.resolve();
    }
    return HttpClient.doPost('/v1/roleRight/role/USER/currentRight')
        .then(res=>{
            if (res.result){
                if(res.data != "" && res.data != undefined && res.data!= null && res.data.length != 0){
                        if(keyarr.indexOf('USER_RIGHT') >= 0){
                            sessionStorage.removeItem('USER_RIGHT');
                        }
                        var list = res.data || [];
                        PrivilegeHelper.saveRight(list);
                }else{
                        Message.error("您还没有系统操作权限，请联系管理员增加权限，2秒后跳转到登录页面");
                        setTimeout(()=>{
                            if ( location.search.indexOf('$Path=/dev')>=0) {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login?$Path=/dev";
                            } else {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login";
                            }
                        },2000)
                }
            } else {
                Message.error("初始化用户权限失败，2秒后跳转到登录页面");
                setTimeout(()=>{
                            if ( location.search.indexOf('$Path=/dev')>=0) {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login?$Path=/dev";
                            } else {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login";
                            }
                        },2000)
            }
        }).catch(err=>{ 
                    console.error(err)
                    if ( err.message === '获取用户权限值失败') {
                        Message.error("初始化用户权限失败，2秒后跳转到登录页面");
                        setTimeout(()=>{
                            if ( location.search.indexOf('$Path=/dev')>=0) {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login?$Path=/dev";
                            } else {
                                sessionStorage.removeItem('USER_RIGHT');
                                window.location.href = "/login";
                            }
                        },2000)
                    }

                })
}

let PrivilegeInterceptor:IInterceptor = {
    handle( next:Function ) {
        loadPrivilegeList()
        next();          
    }
}


export default PrivilegeInterceptor;