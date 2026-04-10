import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import {UserHelper} from './userHelper'
import { Message } from 'fooui';
import {I18nLoader} from '../i18n/loader';
let I18nInterceptor:IInterceptor = {
  handle( next:Function ) {
    I18nLoader.load( function(){
      next();
    } )
  }
}

export default I18nInterceptor;