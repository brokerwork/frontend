class Customer{
  id: number = NaN;
  name:string = '';
  constructor( data:any){
    Object.assign( this, data );
  } 
}

export default Customer;