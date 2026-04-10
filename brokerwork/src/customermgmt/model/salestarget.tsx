enum ProductIdEnum { TW, BW, DW, CW, OW, SC }

enum GenderEnum {
    Male, Female
}

export class SalesTargetPreopertiesDTO {
    createTime: number;
    creator: string;
    customObjective: ObjectiveReport;
    enabled: boolean;
    modifyTime: number;
    objectiveId: string;
    tenantId: string;

    constructor(data: any) {
        Object.assign(this, data, {
            customObjective: new ObjectiveReport(data.customObjective)
        }); 
    }
}

export class ObjectiveReport {
     firstQuarter: FirstQuarterRecord;
     fourthQuarter: FourthQuarterRecord;
     importance: string;
     indicators: string;
     nickname: string;
     roleName: string;
     secondQuarter: SecondQuarterRecord;
     thirdQuarter: ThirdQuarterRecord;
     userId: string;
     year: string;
     yearGoal: string;
     constructor(data: any) {
        Object.assign(this, data); 
    }

}

export class FirstQuarterRecord {
     firstGoal: string;
     quarterGoal: string;
     secondGoal:string;
     thirdGoal: string;
     constructor(data: any) {
        Object.assign(this, data);
    }
}

export class FourthQuarterRecord {
    firstGoal: string;
    quarterGoal: string;
    secondGoal: string;
    thirdGoal: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

 export class SecondQuarterRecord {
    firstGoal: string;
    quarterGoal: string;
    secondGoal: string;
    thirdGoal: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class ThirdQuarterRecord {
    firstGoal: string;
    quarterGoal: string;
    secondGoal: string;
    thirdGoal: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}

export class UserList {
    address: string;
    birthday: string;
    city: string;
    comment: string;
    county: string;
    createDate: string;
    createUserId: string;
    email: string;
    entityNo: string;
    headImage: string;
    id: string;
    modelStatus: string;
    modifyDate: string;
    name: string;
    nickname: string;
    parent: string;
    password: string;
    phone: string;
    postcode: string;
    productId: string;
    province: string;
    pubUserId: string;
    roleId: string;
    tenantId: string;
    username: string;
    constructor(data: any) {
        Object.assign(this, data);
    }
}


