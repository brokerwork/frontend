import {ActionTypes} from '../actions/actionTypes';
import * as DTO from '../model/index';


var tasks: Array<DTO.TaskJobItemDTO> = [];

let initialState: any = {
    logList: {},
    commentList: {},
    taskImportance: [],
    taskJobDropdown: [],
    stepRoleList: [],
    stepUserList: [],
    tasks: tasks, //列表数据
    todoTasks: [], //代办
    processingTasks: [], //处理中
    doneTasks: [], //已完成
    closedTasks: [], //已关闭
    columnOpts: [],
    totalRecords: 0,
    totalPages: 0,
    showBatchTools: false,
    currentPageNumber: 1,
    pageSize: 10
};

function taskReducer(state = initialState, action: any): any {
    switch (action.type) {
        case ActionTypes.TOGGLE_TABLE_ITEM:
            {
                let isSelected: boolean = action.payload.selected;
                let id: string = action.payload.id;
                let tasks: any = [];
                let selectedCount = 0;
                tasks = state.tasks.map((elem: DTO.TaskJobItemDTO) => {
                    if (elem.jobId == id) {
                        if (isSelected) {
                            selectedCount++;
                        }
                        return Object.assign({}, elem, { selected: isSelected });
                    }
                    if (elem.selected) {
                        selectedCount++;
                    }
                    return elem;
                });
                return Object.assign({}, state, {
                    tasks: tasks,
                    showBatchTools: selectedCount > 0,
                    userSelectedCount: selectedCount
                });
            }

        case ActionTypes.TOGGLE_TABLE_ALL_ITEMS:
            {

                let isSelected: boolean = action.payload.selected;
                let ids: Array<string> = action.payload.ids;
                let tasks: any = [];
                let selectedCount = 0;
                state.tasks.forEach((elem: DTO.TaskJobItemDTO) => {
                    if (ids.indexOf(elem.jobId) != -1) {
                        tasks.push(Object.assign({}, elem, { selected: isSelected }));
                        if (isSelected) {
                            selectedCount++;
                        }
                    }
                });

                return Object.assign({}, state, {
                    tasks: tasks,
                    showBatchTools: isSelected,
                    userSelectedCount: selectedCount
                });
            }
        case ActionTypes.LOAD_LIST_VIEW_DATA:
            {
                var jobs: Array<DTO.TaskJobItemDTO> = action.payload ? action.payload.list : [];
                if (jobs.length) {
                    return Object.assign({}, state, {
                        tasks: [...jobs],
                        pageSize: action.payload.size,
                        currentPageNumber: action.payload.pager,
                        totalPages: action.payload.pages,
                        totalRecords: action.payload.total,
                        showBatchTools: false
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.LOAD_TODO_BOARD_DATA:
            {
                var jobs: Array<DTO.TaskJobItemDTO> = action.payload ? action.payload.list : [];
                if (jobs.length) {
                    return Object.assign({}, state, {
                        todoTasks: [...jobs]
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.LOAD_INPROGRESS_BOARD_DATA:
            {
                var jobs: Array<DTO.TaskJobItemDTO> = action.payload ? action.payload.list : [];
                if (jobs.length) {
                    return Object.assign({}, state, {
                        processingTasks: [...jobs]
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.LOAD_DONE_BOARD_DATA:
            {
                var jobs: Array<DTO.TaskJobItemDTO> = action.payload ? action.payload.list : [];
                if (jobs.length) {
                    return Object.assign({}, state, {
                        doneTasks: [...jobs]
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.LOAD_CLOSED_BOARD_DATA:
            {
                var jobs: Array<DTO.TaskJobItemDTO> = action.payload ? action.payload.list : [];
                if (jobs.length) {
                    return Object.assign({}, state, {
                        closedTasks: [...jobs]
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.REMOVE_TASK:
            {
                var removedTaskIds: Array<string> = action.payload;
                var newTasks: any = [];
                state.tasks.forEach((task: DTO.TaskJobItemDTO) => {
                    removedTaskIds.forEach(id => {
                        if (id != task.jobId) {
                            newTasks.push(task)
                        }
                    })
                })
                return Object.assign({}, state, {
                    tasks: newTasks,
                    showBatchTools: false
                })
            }
        case ActionTypes.LOAD_PROJECT_CATEGORIES:
            {
                return Object.assign({}, state, {
                    taskJobDropdown: action.payload
                })
            }
        case ActionTypes.LOAD_TASK_IMPORTANCE_CATEGORIES:
            {
                return Object.assign({}, state, {
                    taskImportance: action.payload
                })
            }
        case ActionTypes.GET_STEP_DATA:
            {
                var data = action.payload ? action.payload : null;
                
                if (data) {
                    return Object.assign({}, state, {
                        stepRoleList: data.stepRoleList,
                        stepUserList: data.stepUserList
                    });
                }
                else {
                    return state;
                }
            }
        case ActionTypes.FETCH_COMMENTS:
            {
                return Object.assign({}, state, {
                    commentList: action.payload
                })
            }
        case ActionTypes.FETCH_LOGS:
            {
                return Object.assign({}, state, {
                    logList: action.payload
                })
            }
        default: {
            return state;
        }
    }
}

export default taskReducer