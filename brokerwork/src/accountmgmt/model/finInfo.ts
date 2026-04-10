class FinInfo {
  id:any;
  login:string = '';
  totalAssets:string = '';
  netAssets:string = '';
  floatingAssets:string = '';
  netIncome:string = '';
  incomeSource:string = '';
  investmentExperience:string = '';
  investmentYear: string = '';
  transactionsPerYear: string = '';
  knowledgeLevel:string = '';
  investmentPurpose:string = '';
  bankAccount:string = '';
  investmentQuota:string = '';
  country:string = '';
  state:string = '';
  city:string = '';
  accountNo:string = '';
  swift:string = '';
  aba:string = '';
  remark:string = '';

  constructor( data:any ) {
    Object.assign( this, data );
  }
}

export default FinInfo;
