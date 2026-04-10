class AddressType {
  cmId:string = '';
  cmType:string = '';
  zhCN:string = '';
  enabled:boolean = true;
  constructor( data:any ) {
    Object.assign( this, data );
  }
}

export default AddressType;
