class UserBelongTo {
  id: number = NaN;
  name:string = '';
  entityNo:string = ''
  constructor( data:any){
    Object.assign( this, data );
  } 
}

export default UserBelongTo;