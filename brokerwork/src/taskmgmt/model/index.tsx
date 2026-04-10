export class ResponseDTOOfPaginationDTOOfTasksItemFlowDTO {
    data: PaginationDTOOfTasksItemFlowDTO;
    mcode: string;
    result: boolean;
}
export class PaginationDTOOfTasksItemFlowDTO {
    list: Array<TasksItemFlowDTO>;
    offset: number;
    pager: number;
    pages: number;
    size: number;
    total: number;
}
export class TasksItemFlowDTO {
    createTime: number;
    disable: boolean;
    enabled: boolean;
    flowList: Array<TasksFlow>;
    itemId: string;
    modifyTime: number;
    tasksItem: TasksItem;
    productId: string;
    tenantId: string;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class TasksFlow {
    category: FlowCategory;
    stepList: Array<FlowStep>;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class TasksItem {
    comments: string;
    itemName: string;
    itemNo: string;
    itemRoleList: Array<KeyValPair>;
    itemUserList: Array<KeyValPair>;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class FlowCategory {
    categoryId: string;
    categoryName: string;
    categoryNo:string;
    color: string;
    comments: string;
    disable: boolean;
    enabled: boolean;
    verify: boolean;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class FlowStep {
    autoAssign: boolean;
    stepName: string;
    stepRoleList: Array<KeyValPair>;
    stepUserList: Array<KeyValPair>;
    turnouts: number;
    constructor(data) {
        Object.assign(this, data);
    }
}
export class KeyValPair {
    key: string;
    name: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class TasksItemSearchDTO {
    enabled: boolean;
    nowPage: number;
    pageSize: number;
    productId: string = 'BW';
    tenantId: string = 'T001001';
    constructor(data) {
        Object.assign(this, data);
    }
}

export class TaskJobSearchDTO {
    assign: boolean;
    board: string;
    enabled: boolean;
    fuzzyItem: string;
    fuzzyVal: string;
    nowPage: number;
    pageSize: number;
    productId: string;
    roleId: string;
    searchDate: string;
    searchEnd: number;
    searchStart: number;
    tenantId: string;
    userId: string;
    constructor(data) {
        Object.assign(this, data);
    }
}

export class ResponseDTOOfPaginationDTOOfTaskJobItemDTO {
    data: PaginationDTOOfTaskJobItemDTO;
    mcode: string;
    result: boolean;
}
export class PaginationDTOOfTaskJobItemDTO {
    list: Array<TaskJobItemDTO>;
    offset: number;
    pager: number;
    pages: number;
    size: number;
    total: number;
}
export class TaskJobItemDTO {
    allStep: number;
    commentList: Array<JobComment>;
    createTime: number;
    creator: KeyValPair;
    verify: boolean;
    emergency: boolean;
    endTime: number;
    flowCategory: KeyValPair;
    itemId: string;
    jobId: string;
    jobName: string;
    jobNo: string;
    jobTag: string;
    content: string;
    modifyTime: number;
    nowStep: number;
    priority: string;
    processorList: Array<JobProcessor>;
    productId: string;
    resource: string;
    state: string;
    tenantId: string;
}
export class JobComment {
    automatic: boolean;
    content: string;
    createTime: number;
    jcFile: string;
    jcId: string;
    reviewer: KeyValPair;
}
export class TaskJobCreateDTO {
    commentList: Array<JobComment>;
    endTime: number;
    flowCategory: KeyValPair;
    itemId: string;
    jobName: string;
    jobTag: string;
    priority: string;
    emergency: boolean;
    processorList: Array<JobProcessor>;
    resource: string;
}
export class JobProcessor {
    handle: boolean;
    realName: string;
    userId: string;
}

export class TaskJobDropDownDTO {
    categoryList:Array<KeyValPair>;
    taskItem:KeyValPair;
}