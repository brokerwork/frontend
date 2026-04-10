export class ResponseDTOOfPaginationDTOOfCustomerContractsDTO {
    data: PaginationDTOOfCustomerContractsDTO;
    mcode: string;
    result: boolean;
    constructor(data){
        Object.assign(this, data);
    }
}
export class PaginationDTOOfCustomerContractsDTO {
    list: Array<CustomerContractsDTO>;
    offset: number;
    pager: number;
    pages: number;
    size: number;
    total: number;
    constructor(data){
        Object.assign(this, data);
    }
}
export class CustomerContractsDTO {
    contractId: string;
    createTime: number;
    creator: string;
    customContract: CustomContract;
    customerId: string;
    enabled: boolean;
    modifyTime: number;
    redundancy: CustomRedundancy;
    tenantId: string;
    constructor(data){
        Object.assign(this, data);
    }
}
export class CustomContract {
    comments: string;
    contractEndDay: number;
    contractFile: string;
    contractName: string;
    contractNo: string;
    contractStartDay: number;
    contractState: string;
    firstSiger: string;
    otherSiger: string;
    product: KeyValPair;
    secondSiger: string;
    signTime: number;
    totalAmount: number;
    constructor(data){
        Object.assign(this, data);
    }
}
export class CustomRedundancy {
    customName: string;
    oweId: string;
    oweName: string;
    constructor(data){
        Object.assign(this, data);
    }
}
export class KeyValPair {
    key: string;
    name: string;
    constructor(data){
        Object.assign(this, data);
    }
}