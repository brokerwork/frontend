import {UserInfoInterceptor} from './userInfoInterceptor'
import I18nInterceptor from './i18nInterceptor'
import FileUploadInfoInterceptor from './fileUploadInfoInterceptor'
import CountryCityInterceptor from './countryCityInterceptor';
import PrivilegeInterceptor from './privilegeInterceptor';
import ParameterTypeInterceptor from './parameterTypeInterceptor';
// interceptors
interface IInterceptor {
  handle: ( next:Function ) => void
}

// 此 enum 必须非零，因为下面有对此 enum 是否存在的 if 判断
enum InterceptorNames {
  UserInfo = 1,
  I18n = 2,
  FileUpload = 3,
  CountryCity = 4,
  UiPrivilege = 5,
  ParameterType = 6
}

let Interceptors:any = {
  [InterceptorNames.UserInfo]: UserInfoInterceptor,
  [InterceptorNames.I18n]: I18nInterceptor,
  [InterceptorNames.FileUpload]: FileUploadInfoInterceptor,
  [InterceptorNames.CountryCity]: CountryCityInterceptor,
  [InterceptorNames.ParameterType]: ParameterTypeInterceptor,
  [InterceptorNames.UiPrivilege]: PrivilegeInterceptor
};

class InterceptorLoader {
  itcptNames: Array<InterceptorNames>;
  runningItcptIndex: number;
  finallCallback: Function;
  
  constructor( names:Array<InterceptorNames> ) {
    this.itcptNames = names;
    this.runningItcptIndex = -1;
  }
  
  next = () => {
    this.runningItcptIndex++;
    let interceptorName = this.itcptNames[this.runningItcptIndex];
    let currInterceptor:IInterceptor = Interceptors[ interceptorName ];
    if ( interceptorName ) {
      if ( !currInterceptor ) throw "Can not find interceptor: " + InterceptorNames[ interceptorName ];
      currInterceptor.handle( this.next )
    } else {
      if ( this.finallCallback ) {
        setTimeout(this.finallCallback, 50);
      }
    }
  }
  
  handle( callback:Function ) {
    this.finallCallback = callback;
    this.next();
  }
}

export { InterceptorLoader, InterceptorNames, IInterceptor };