 class SeverList {
  serverId: number; 
  vendor: string = '';
  desc: string = '';
  constructor( data:any ) {
    Object.assign( this, data );
  }
}

export default SeverList;