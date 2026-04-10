class CertInfo {
  identityType:string = '';
  identityNo:string = '';
  identityFile1: string = '';
  identityFile2:string = '';
  addressDocType:string = '';
  addressFile1:string = '';
  addressFile2:string = '';

  constructor( data:any ) {
    Object.assign( this, data );
  }
}

export default CertInfo;
