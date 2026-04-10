import * as React from 'react';
import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import {UserHelper} from './userHelper'
import { Message, Modal, LoadingMask} from 'fooui';
import {DeleteConfirm} from '../customermgmt/components/deleteConfirm';
import { utils } from '../common/utils'
let UserInfoInterceptor:IInterceptor = {
  handle( next:Function ) {
    HttpClient.doGet('/v1/user/token').then(res=>{
        if (!res.result) {
            if(res.mcode === "PUB_AUTH_0000018"){
                LoadingMask.unmaskAll();
                next();
                let refContentCreator = function(){
                     return <div className="confirmModal">
                                您已经登录超时，点击确认返回登陆页面
                            </div>
                };
                var m = Modal.show({
                    title: '登录超时确认',
                    hasOk: true,
                    onOk: () => {
                        if ( location.search.indexOf('$Path=/dev')>=0) {
                            sessionStorage.removeItem( UserHelper.SESSION_KEY_USER_INFO);
                            window.location.href = "/login?$Path=/dev";
                         } else {
                            sessionStorage.removeItem( UserHelper.SESSION_KEY_USER_INFO);
                            window.location.href = "/login";
                         }
                         m.close();
                    },
                    onCancel: ()=>{},
                       refContentCreator: refContentCreator
                    });
            }else{
                LoadingMask.unmaskAll();
                next();
                Message.error("初始化用户信息失败，2秒后跳转到登录页面");
                setTimeout(()=>{
                    if ( location.search.indexOf('$Path=/dev')>=0) {
                            window.location.href = "/login?$Path=/dev";
                    } else {
                            window.location.href = "/login";
                    }
                },2000)
            }
        } else {
            next();
        }
    })
  }
}

export {UserInfoInterceptor};