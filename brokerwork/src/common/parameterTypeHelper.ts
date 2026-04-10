import {I18nLoader} from '../i18n/loader';

let parameterTypeMap:any = {};
let ParameterTypeHelper ={
  setparameterType( ccArray:any ) {
    let lang = I18nLoader.getLang();
    let _lang = lang.replace('-', '');
    
    if ( ccArray ) {
      ccArray.forEach( (ccItem:any)=>{
        parameterTypeMap[ccItem.cmId] = ccItem[_lang]
      } )
    }
  },
  getText( cmId:string ) {
    return parameterTypeMap[cmId];
  }
}

export default ParameterTypeHelper;