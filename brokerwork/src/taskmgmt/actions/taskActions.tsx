import {ActionTypes} from './actionTypes';
import {HttpClient} from '../../http/httpclient';
import * as DTO from '../model/index';
import {Message} from 'fooui';
import {Action} from "redux/index";
import {UserHelper} from '../../common/userHelper';

/*
*
* 一个项目包含多个任务Category, 一个任务Category包含多个步骤流程
* */
export function addProject(taskItem: DTO.TasksItem) {
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/setting/NA/item/upsert', taskItem)
            .then(res => {
                if (res.result) {
                    Message.success('添加项目成功');
                } else {
                    Message.error('添加项目失败');
                }
                return res
            })
    }
}

// 添加更新任务项目
export function updateProject(itemId: string, taskItem: DTO.TasksItem) {
    return (dispatch: Function) => {
        return HttpClient.doPost(`/v1/tasks/setting/${itemId}/item/upsert`, taskItem)
            .then(res => {
                if (res.result) {
                    Message.success('更新项目成功');
                } else {
                    Message.error('更新项目失败');
                }
                return res
            })
    }
}
// 添加更新任务类型
export function addCategory(itemId: string, dto: DTO.FlowCategory) {
    return (dispatch: Function) => {
        return HttpClient.doPost(`/v1/tasks/setting/${itemId}/category/upsert`, dto)
            .then(res => {
                if (res.result) {
                    Message.success('添加项目分类成功');
                } else {
                    Message.error('添加项目分类失败');
                }
                return res
            })
    }
}
// 添加更新任务类型
export function updateCategory(itemId: string, dto: DTO.FlowCategory) {
    return (dispatch: Function) => {
        return HttpClient.doPost(`/v1/tasks/setting/${itemId}/category/upsert`, dto)
            .then(res => {
                if (res.result) {
                    Message.success('更新项目分类成功');
                } else {
                    Message.error('更新项目分类失败');
                }
                return res
            })
    }
}

// 添加更新任务流程步骤
export function addSteps(itemId: string, categoryId: string, stepList: Array<DTO.FlowStep>) {
    return (dispatch: Function) => {
        return HttpClient.doPost(`/v1/tasks/setting/${itemId}/${categoryId}/steps/upsert`, stepList)
            .then(res => {
                if (res.result) {
                    Message.success('添加步骤成功');
                } else {
                    Message.error('添加步骤失败');
                }
                return res
            })
    }
}
// 添加更新任务流程步骤
export function updateSteps(itemId: string, categoryId: string, stepList: Array<DTO.FlowStep>) {
    return (dispatch: Function) => {
        return HttpClient.doPost(`/v1/tasks/setting/${itemId}/${categoryId}/steps/upsert`, stepList)
            .then(res => {
                if (res.result) {
                    Message.success('更新步骤成功');
                } else {
                    Message.error('更新步骤失败');
                }
                return res
            })
    }
}
// 任务项目列表
export function loadProjects(param: DTO.TasksItemSearchDTO) {
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/setting/list', param)
            .then((res: DTO.ResponseDTOOfPaginationDTOOfTasksItemFlowDTO) => {
                if (!res.result) {
                    Message.error('获取项目列表失败');
                }
                return res
            })
    }
}

//待办看板
export function loadTodoBoardData(newParam: any) {
    let userInfo: any = UserHelper.getUserInfo();
    return (dispatch: Function) => {
        var param = {
            "assign": false,
            "roleId": userInfo.roleId,
            "userId": userInfo.pubUserId,
            "board": "TODO",
            "enabled": true,
            "nowPage": 1,
            "pageSize": 10,
            "productId": "BW"
        };
        param = Object.assign(param, newParam);
        return HttpClient.doPost('/v1/tasks/jobs/todo/board', param)
            .then(res => {
                dispatch({
                    type: ActionTypes.LOAD_TODO_BOARD_DATA,
                    payload: res.data
                })
            })
    }
}
//处理中看板
export function loadProcessingBoardData(newParam: any) {
    let userInfo: any = UserHelper.getUserInfo();
    return (dispatch: Function) => {
        var param = {
            "assign": false,
            "roleId": userInfo.roleId,
            "userId": userInfo.pubUserId,
            "board": "Processing",
            "enabled": true,
            "nowPage": 1,
            "pageSize": 10,
            "productId": "BW"
        };
        param = Object.assign(param, newParam);
        return HttpClient.doPost('/v1/tasks/jobs/processing/board', param)
            .then(res => {
                dispatch({
                    type: ActionTypes.LOAD_INPROGRESS_BOARD_DATA,
                    payload: res.data
                })
            })
    }
}
//已完成看板
export function loadDoneBoardData(newParam: any) {
    let userInfo: any = UserHelper.getUserInfo();
    return (dispatch: Function) => {
        var param = {
            "assign": false,
            "roleId": userInfo.roleId,
            "userId": userInfo.pubUserId,
            "board": "Completed",
            "enabled": true,
            "nowPage": 1,
            "pageSize": 10,
            "productId": "BW"
        };
        param = Object.assign(param, newParam);
        return HttpClient.doPost('/v1/tasks/jobs/completed/board', param)
            .then(res => {
                dispatch({
                    type: ActionTypes.LOAD_DONE_BOARD_DATA,
                    payload: res.data
                })
            })
    }
}
//已关闭看板
export function loadClosedBoardData(newParam: any) {
    let userInfo: any = UserHelper.getUserInfo();
    return (dispatch: Function) => {
        var param = {
            "assign": false,
            "roleId": userInfo.roleId,
            "userId": userInfo.pubUserId,
            "board": "Closed",
            "enabled": true,
            "nowPage": 1,
            "pageSize": 10,
            "productId": "BW"
        };
        param = Object.assign(param, newParam);
        return HttpClient.doPost('/v1/tasks/jobs/closed/board', param)
            .then(res => {
                dispatch({
                    type: ActionTypes.LOAD_CLOSED_BOARD_DATA,
                    payload: res.data
                })
            })
    }
}
// 任务列表
export function loadListViewData(param: DTO.TaskJobSearchDTO) {
    let userInfo: any = UserHelper.getUserInfo();
    
    var defaultParam = {
        "assign": true,
        "board": "All",
        "enabled": true,
        "nowPage": 1,
        "pageSize": 10,
        "roleId": userInfo.roleId,
        "userId": userInfo.pubUserId,
        "productId": "BW"
    };
    defaultParam = Object.assign(defaultParam, param);
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/jobs/list', defaultParam)
            .then((res) => {
                dispatch({
                    type: ActionTypes.LOAD_LIST_VIEW_DATA,
                    payload: res.data
                })
            })
    }
}
// 领取任务
export function claimTask(task: DTO.TaskJobItemDTO) {
    return (dispatch: Function) => {
        var itemId = task.itemId;
        var categoryId = task.flowCategory.key;
        var jobId = task.jobId;
        return HttpClient.doPost(`/v1/tasks/jobs/${itemId}/${categoryId}/${jobId}/claimed`)
            .then(res => {
                if (res.result) {
                    Message.success('任务领取成功!')
                }
                else {
                    Message.error('任务领取失败!')
                }
            })
    }
}
//新增任务 
export function addTask(param: DTO.TaskJobCreateDTO) {
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/jobs/create', param)
            .then((res: DTO.ResponseDTOOfPaginationDTOOfTaskJobItemDTO) => {
                if (res.result) {
                    Message.success('创建任务成功！');
                }
                else {
                    Message.error('创建任务失败!');
                }
            });
    }
}
// 处理任务
export function processTask(param: any) {
    let url: string = `/v1/tasks/jobs/${param.itemId}/${param.categoryId}/${param.jobId}/processing`;
    return (dispatch: Function) => {
        return HttpClient.doPost(url, param.jobProsessors)
            .then((res: DTO.ResponseDTOOfPaginationDTOOfTaskJobItemDTO) => {
                if (res.result) {
                    Message.success('完成任务成功')
                }
                else {
                    Message.error('完成任务失败!');
                }
            });
    }
}
// 拒绝任务
export function rejectTask(param: DTO.TaskJobItemDTO) {
    let url: string = `/v1/tasks/jobs/${param.itemId}/${param.flowCategory.key}/${param.jobId}/refuse`;
    return (dispatch: Function) => {
        return HttpClient.doPost(url, {})
            .then((res: DTO.ResponseDTOOfPaginationDTOOfTaskJobItemDTO) => {
                if (res.result) {
                    Message.success('拒绝任务成功!');
                }
                else {
                    Message.error('拒绝任务失败!');
                }
            })
    }
}
// 关闭任务
export function closeTask(param: any) {
    let url: string = '/v1/tasks/jobs/closing';
    return (dispatch: Function) => {
        return HttpClient.doPost(url, param)
            .then((res: DTO.ResponseDTOOfPaginationDTOOfTaskJobItemDTO) => {
                if (res.result) {
                    Message.success('关闭任务成功!');
                }
                else {
                    Message.error('关闭任务失败!');
                }
            })
    }
}
// 删除任务
export function removeTask(idList: Array<string>) {
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/jobs/remove', idList)
            .then(res => {
                if (res.result) {
                    if (!res.data.length) {
                        Message.success('删除任务成功');
                    }
                    else {
                        Message.error('只有部分任务可以删除');
                    }
                    dispatch(loadListViewData({}));
                }
                else {
                    Message.error('删除失败!');
                }
            });
    }
}
// 任务项目下拉框列表
export function loadProjectCategories() {
    return (dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/setting/down-list')
            .then(res => {
                if (res.result) {
                    dispatch({
                        type: ActionTypes.LOAD_PROJECT_CATEGORIES,
                        payload: res.data
                    })
                }
            })
    }
}

// 任务重要性下拉框
export function loadTaskImportanceList() {
    let url = '/v1/tasks/jobs/dropdown/importance/list';
    return (dispatch: Function) => {
        return HttpClient.doGet(url, {})
            .then((res: any) => {
                if (res.result) {
                    dispatch({
                        type: ActionTypes.LOAD_TASK_IMPORTANCE_CATEGORIES,
                        payload: res.data
                    })
                }
            });
    };
}

// 回收站接口
// 任务回收站列表
export function loadRecyclebinData(param: any) {
    let userInfo: any = UserHelper.getUserInfo();
    let defaultParam = {
        "assign": true,
        "board": "All",
        "enabled": true,
        "nowPage": 1,
        "pageSize": 10,
        "userId": userInfo.pubUserId
    };
    defaultParam = Object.assign(defaultParam, param);
    return ((dispatch: Function) => {
        return HttpClient.doPost('/v1/tasks/jobs/recycle')
            .then((res: any) => {
                if (res.result) {
                    dispatch({
                        type: ActionTypes.LOAD_RECYCLEBIN_DATA,
                        payload: res.data
                    });
                }
            });
    });
}

// 任务步骤数据
export function addEditTaskByStep(param: any) {
    if (param) {
        let url: string = `/v1/tasks/setting/${param.itemId}/${param.categoryId}/${param.step}/task-step`;
        return (dispatch: Function) => {
            return HttpClient.doPost(url)
                .then((res: any) => {
                    if (res.result) {
                        dispatch({
                            type: ActionTypes.GET_STEP_DATA,
                            payload: res.data
                        })
                    }
                    else {
                        Message.error('获取任务步骤数据出错!');
                    }
                })
        }
    }
    else {
        Message.error('addEditTaskByStep：缺少参数');
    }
}

// 保存基本信息
export function saveBasicInfo(param: any) {
    let url: string = `/v1/tasks/jobs/${param.jobId}/edit`;
    return (dispatch: Function) => {
        return HttpClient.doPost(url, param)
            .then((res: any) => {
                if (res.result) {
                    Message.success('基本信息保存成功');
                }
                else {
                    Message.error('基本信息保存失败');
                }
            })
    }
}

// 添加评论信息
export function addComments(param: any) {
    let url: string = `/v1/tasks/jobs/${param.jobId}/comments`;
    let defaultParam: any = {
        "automatic": true
    };
    defaultParam = Object.assign(defaultParam, param);
    return (dispatch: Function) => {
        return HttpClient.doPost(url, defaultParam)
            .then((res: any) => {
                if (res.result) {
                    Message.success('发表评论成功');
                }
                else {
                    Message.error('发表评论失败');
                }
            })
    }
}

// 获取评论信息
export function fetchComments(jobId: string) {
    let url: string = `/v1/tasks/jobs/${jobId}/comments/list`;
    return (dispatch: Function) => {
        return HttpClient.doPost(url)
            .then((res: any) => {
                if (res.result) {
                    dispatch({
                        type: ActionTypes.FETCH_COMMENTS,
                        payload: res.data
                    });
                }
                else {
                    Message.error('获取评论失败!');
                }
            })
    }
}

// 获取任务操作日志
export function fetchOperationLogs(jobId: string) {
    let url: string = `/v1/tasks/jobs/${jobId}/journals`;
    return (dispatch: Function) => {
        return HttpClient.doPost(url)
        .then((res: any) => {
            if (res.result) {
                dispatch({
                    type: ActionTypes.FETCH_LOGS,
                    payload: res.data
                });
            }
            else {
                Message.error('获取操作日志失败');
            }
        })
    }
}