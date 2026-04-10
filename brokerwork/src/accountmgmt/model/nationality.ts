class Nationality {
  id:string = '';
  code: string = '';
  value: string = ''
  constructor( d:any ){
    Object.assign( this, d );
  }
}

export default Nationality;
