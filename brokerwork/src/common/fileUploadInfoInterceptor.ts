import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import {UserHelper} from './userHelper'
import FileUploadHelper from './ossHelper';

let FileUploadInfoInterceptor:IInterceptor = {
  handle( next:Function ) {
    HttpClient.doGet( '/v1/aliyun/signature' ).then( res=>{
      if ( res.result ) {
        FileUploadHelper.setSignature( res.data )
      }
      next()
    } ).catch( function () {
      next()
    } )
  }
}

export default FileUploadInfoInterceptor;