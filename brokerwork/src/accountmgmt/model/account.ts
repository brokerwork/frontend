export class AccountDTO {
  gender:number = 1;
  birthday:string = '';
  nationality:string = '';
  nationalityName:string = '';
  bCountry:string = '';
  bCountryName:string = '';
  bState:string = '';
  bStateName:string = '';
  bCity:string = '';
  bCityName:string = '';
  userId:string = '';
  userName:string = '';
  customerId:string = '';
  customerName:string = '';
  login:string = ''; // 账号，这里用来做id(唯一标识)
  group:string = '';
  enable:number = 1;
  enableReadonly:number = 1;
  name:string = '';
  country:string = ''; // 居住
  state:string = ''; 
  city:string = '';
  zipcode:string = '';
  address:string = '';
  phone:string = '';
  email:string = '';
  comment:string = '';
  status:string = '';
  regdate:number = 0;
  leverage:number = 0;
  balance:number = 0;
  equity:number = 0;  //净值
  profit:number = 0; //浮动盈亏
  workAge: string = '';
  company: string = '';
  externalInfo:ExternalInfo;
  credit: any;
  selected: boolean = false; // 标识当前item是否在table中被选中

  constructor( data:any ) {
    if ( data ) {
      Object.assign( this, data, {
        externalInfo: new ExternalInfo(data.externalInfo)
      });
    }
  }
}
export class ExternalInfo {
    bCity: string;
    bCityName: string;
    bCountry: string;
    bCountryName: string;
    bState: string;
    bStateName: string;
    company: string;
    customerId: string;
    customerName:string;
    familyName:string;
    gender:number;
    login:number;
    nationality:string;
    nationalityName:string;
    objectId:string;
    serverId:string;
    tenantId:string;
    userId:number;
    userName:string;
    vendor:string;
    workAge:string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

