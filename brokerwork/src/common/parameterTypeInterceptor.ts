import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import ParameterTypeHelper from './parameterTypeHelper'

let ParameterTypeInterceptor:IInterceptor = {
  handle(next:Function){
    HttpClient.doGet( '/v1/user/introduce/parameterTypes' ).then( res=>{
      if ( res.result && res.data ) {
        ParameterTypeHelper.setparameterType( res.data )
        next();
      }
    } )
  }
}

export default ParameterTypeInterceptor;