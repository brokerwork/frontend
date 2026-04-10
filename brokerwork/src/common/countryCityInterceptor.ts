import { IInterceptor } from './interceptorLoader';
import { HttpClient } from '../http/httpclient';
import CountryCityHelper from './countryCityHelper'

let CountryCityInterceptor: IInterceptor = {
  handle(next: Function) {
    HttpClient.doGet('/v1/static/countryCityAll').then(res => {
      if (res.result && res.data) {
        CountryCityHelper.setCountryCity(res.data)
        next();
      }
    })
  }
}

export default CountryCityInterceptor;
