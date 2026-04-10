class AccountGroup {
  cmId: number = NaN;
  zhCN: string = '';
  constructor( data:any ) {
    Object.assign( this, data );
  }
}

export default AccountGroup;