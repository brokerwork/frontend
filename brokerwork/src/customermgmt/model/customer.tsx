enum ProductIdEnum { TW, BW, DW, CW, OW, SC }

enum GenderEnum {
    Male, Female
}
export class ResponseDTOOfCustomerDetailListDTO {
    data: CustomerDetailListDTO;
    mcode:string;
    result:boolean;
}
export class CustomerDetailListDTO {
    contactList:Array<CustomerContactsDTO>;
    contractList:Array<CustomerContractsDTO>;
    opportunities:Array<CustomerOpportunitiesDTO>;
    paymentList:Array<CustomerPaymentsDTO>;
}
export class CustomerPropertiesDTO {
    customerId: string;
    tenantId: string;
    createTime: number;
    creator: string;
    customProfile: CustomProfile;
    enabled: boolean;
    mainContact: CustomContact;
    modifyTime: number;
    productId: string;
    recordList: Array<SalesRecord>;
    redundancy: CustomRedundancy;

    constructor(data: any) {
        Object.assign(this, data, {
            customProfile: new CustomProfile(data.customProfile),
            mainContact: new CustomContact(data.mainContact),
            recordList: data.recordList ? data.recordList.map((item: any) => {
                return new SalesRecord(item);
            }) : null,
            redundancy: new CustomRedundancy(data.redundancy)
        });
    }
}

export class CustomProfile {
    email: string;
    address: string;
    ambitious: string;
    city: string;
    comments: string;
    country: string;
    customNo: string;
    customSource: string;
    customType: string;
    faxes: string;
    idNum: string;
    idType: string;
    idUrl1: string;
    idUrl2: string;
    importance: string;
    introducer: string;
    phone: string;
    postcode: string;
    priority: string;
    province: string;
    revisitDay: number;
    site: string;
    social: string;

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
export class SalesRecord {
    autoRecord: boolean;
    comments: string;
    communication: string;
    createTime: number;
    recordFile: string;
    recordId: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomRedundancy {
    customName: string;
    oweId: string;
    oweName: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class CustomerSwitchOweDTO {
    customerId: string;
    redundancy: CustomRedundancy;

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
        Object.assign(this, data);
    }
}

export class SalesRecordDTO {
    customerId: string;
    priority: string;
    revisitDay: number;
    salesRecord: SalesRecord;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class CustomerDetailListDTO {
    contactList: Array<CustomerContactsDTO>;
    contractList: Array<CustomerContractsDTO>;
    opportunities: Array<CustomerOpportunitiesDTO>;
    paymentList: Array<CustomerPaymentsDTO>;
    constructor(data: any) {
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
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomerOpportunitiesDTO {
    createTime: number;
    creator: string;
    customOpportunity: CustomOpportunity;
    customerId: string;
    enabled: boolean;
    modifyTime: number;
    opportunityId: string;
    redundancy: CustomRedundancy;
    tenantId: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomerPaymentsDTO {
    billId: string;
    createTime: number;
    creator: string;
    customPayment: CustomPayment;
    customerId: string;
    enabled: boolean;
    modifyTime: number;
    redundancy: CustomRedundancy;
    tenantId: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomPayment {
    billNo: string;
    billState: string;
    comments: string;
    contractNo: string;
    receivedAmount: number;
    receivedDay: number;
    planAmount:number;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomContract {
    comments: string;
    contractEndDay: number;
    contractFile: string;
    contractName: string;
    contractId: string;
    contractStartDay: number;
    contractState: string;
    firstSiger: string;
    otherSiger: string;
    product: KeyValPair;
    secondSiger: string;
    signTime: number;
    totalAmount: number;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class KeyValPair {
    key: string;
    name: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class CustomOpportunity {
    comments: string;
    expectAmount: number;
    expectDay: number;
    opportunityName: string;
    opportunityType: string;
    saleProcess: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}
export class PropertySearchDTO {
    enabled: boolean;
    fuzzyItem: string;
    fuzzyVal: string;
    nowPage: number;
    pageSize: number;
    searchDate: string;
    searchEnd: number;
    searchStart: number;
    senseItem: string;
    senseList: Array<string>;
    tenantId: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class ResponseDTOOfCustomerPropertiesDTO {
    data:CustomerPropertiesDTO;
    mcode:string;
    result:boolean;
}