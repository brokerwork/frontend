
export class CustomRedundancy {
    customName: string;
    oweId: string;
    oweName: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class CustomContact {
    birthday: number;
    comments: string;
    contactsName: string;
    email: string;
    gender: string;
    others: string;
    phone: string;
    resign: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class CustomerContactsDTO {
    contactId: string;
    createTime: number;
    creator: string;
    customContact: CustomContact;
    customerId: string;
    enabled: boolean;
    master: boolean;
    modifyTime: number;
    redundancy: CustomRedundancy;
    tenantId: string;
    constructor(data: any) {
        Object.assign(this, data, {
            customContact: new CustomContact(data.customContact),
            redundancy: new CustomRedundancy(data.redundancy)
        })
    }
}

export class PaginationDTOOfCustomerContactsDTO {
    list: Array<CustomerContactsDTO>;
    offset: number;
    pager: number;
    pages: number;
    size: number;
    total: number;
    constructor(data: any) {
        Object.assign(this, data, {
            list: data.list ? data.list.map((elem: any)=>{
                return new CustomerContactsDTO(elem);
            }) : null
        });
    }
}

export class ResponseDTOOfPaginationDTOOfCustomerContactsDTO {
    data:PaginationDTOOfCustomerContactsDTO;
    mcode: string;
    result: boolean;
    constructor(data: any) {
        Object.assign(this, data, {
            data: new PaginationDTOOfCustomerContactsDTO(data.data)
        });
    }
}