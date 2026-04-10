/**
 * Data Structor is coppied from swagger
 * http://api.tmsc.lwork.com/pages/dist/index.html ==> bw-facade
 */


class BWUserDTO {
    address:string = '';
    createDate:string = '';
    birthday:string = "";
    city:string = "";
    comment:string = "";
    country:string = "";
    detail:string  = "";
    email:string = "";
    entityNo:string  = "";
    headImage:string = "";
    id:string  = "";
    nickname:string = "";
    username:string = "";
    name:string = '';
    parent:string = "";
    password:string = "";
    phone:string = "";
    login:any = "";
    postcode:string = "";
    province:string = "";
    roleId:string = "";
    userId:string  = "";
    levelId:string = "";
    selected:boolean = false;
    active:boolean;
    vendorServerId:string;
    commission:any;
    subUserCount: any;
    needInitPass:boolean;
    constructor(data:any){
        Object.assign(this, data);
    }
}
// class AddressDTO {
//     city:string;
//     county:string;
//     detail:string;
//     postcode:string;
//     province:string;

//     constructor(data){
//         Object.assign(this, data);
//     }
// }
// class UserExtDTO {
//     birthday:string;
//     headImage:string;
//     nickname:string;
//     username:string;

//     constructor(data){
//         Object.assign(this, data);
//     }
// }

export { BWUserDTO };