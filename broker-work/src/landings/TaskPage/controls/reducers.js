import { handleActions } from 'redux-actions';
import { dateRange } from 'utils/config';
import { combineReducers } from 'redux';
import { setItem as setSessionStorageItem } from 'utils/sessionStorageShare';
import * as settingReducers from './ObjectSettingReducers';
import * as taskDetailsReducers from './TaskDetailsReducers';
import {
  TASK_TYPE_KEY,
  TASK_TYPES,
  TASK_BOARD_CLAIMED,
  ADVANCED_SEARCH_CONDITIONS,
  ADVANCED_SEARCH_CONFIG
} from '../contants';
import {
  GET_OBJECTS,
  GET_OBJECT_TASK_GROUPS,
  MODIFY_PARAMS,
  SELECT_TASK,
  CLEAN_TASKS,
  UPDATE_TASK_OBJECT,
  GET_USER_AGENT_FORM_COLUMNS,
  GET_TASKS,
  GET_TA_RIGHT,
  GET_IS_ADAPT_ON,
  UPDATE_UPDATE_TIME,
  UPDATE_FUZZY_SEARCH_TEXT
} from './actions';
export const object_list = handleActions(
  {
    [GET_OBJECTS]: (state, { type, payload }) => {
      const order = [TASK_TYPES.TA, TASK_TYPES.AGENCY];
      return order.reduce((result, item) => {
        const match = payload.find(task => task.taskType === item);
        if (match) result.push(match);
        return result;
      }, []);
    }
  },
  []
);

export const objectDetails = handleActions(
  {
    [GET_OBJECT_TASK_GROUPS]: (state, { payload }) => payload
  },
  {
    categorys: [],
    itemId: '',
    itemName: ''
  }
);

const DEFAULT_SEARCH_CONDITIONS = [
  { field: 'taskBoard', opt: 'EQ', value: TASK_BOARD_CLAIMED },
  {
    field: 'CreateTime',
    opt: 'EQ',
    value: [
      dateRange.last30days.start.valueOf(),
      dateRange.last30days.end.valueOf()
    ].join(ADVANCED_SEARCH_CONFIG.dateSplit)
  }
];

const DEFAULT_SEARCH_PARAMS = {
  itemId: '',
  fuzzyVal: '',
  fuzzyItem: '',
  sortby: 'CreateTime',
  orderDesc: true,
  nowPage: 1,
  pageSize: 20,
  taskBoard: TASK_BOARD_CLAIMED, //虽然taskBoard被移至高级搜索中，但是任务模块中有很多代码在params中获取taskBoard。所以保留这个字段并维护值
  advanceConditions: DEFAULT_SEARCH_CONDITIONS
};

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => {
      let newState = { ...payload };
      const taskBoard = payload.advanceConditions.find(
        item => item.field === 'taskBoard'
      );
      const categoryId = payload.advanceConditions.find(
        item => item.field === 'categoryId'
      );
      if (taskBoard && taskBoard.value) {
        newState.taskBoard = taskBoard.value;
      }
      if (categoryId && 'value' in categoryId) {
        newState.categoryId = categoryId.value;
      }
      return newState;
    },
    [UPDATE_FUZZY_SEARCH_TEXT]: (state, { payload }) => ({
      ...state,
      fuzzyVal: payload
    })
  },
  DEFAULT_SEARCH_PARAMS
);

export const paginationInfo = handleActions(
  {
    [GET_TASKS]: (state, { payload }) => {
      const { page } = payload;
      const size = page['size'];
      return {
        pageNo: page['pager'],
        pageSize: size,
        total: page['total']
      };
    }
  },
  {
    pageNo: 0,
    pageSize: 0,
    total: 0
  }
);

export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

export const extrasTotalInfo = handleActions(
  {
    [GET_TASKS]: (state, { payload }) =>
      typeof payload.total === 'undefined' ? '' : payload.total,
    [UPDATE_TASK_OBJECT]: (state, { payload }) => ''
  },
  ''
);

export const taskGroupTasks = handleActions(
  {
    [GET_TASKS]: (state, { payload }) =>
      (payload.page && payload.page.list) || [],
    [UPDATE_TASK_OBJECT]: (state, { payload }) => []
  },
  []
);

export const setting = combineReducers({ ...settingReducers });
export const taskDetails = combineReducers({ ...taskDetailsReducers });

//已选任务
export const selectedTasks = handleActions(
  {
    [SELECT_TASK]: (state, { payload: { task, mergeMode } }) => {
      let tasks = task;
      if (!Array.isArray(task)) {
        tasks = [task];
      }
      return tasks.reduce((taskMap, item) => {
        if (taskMap[item.jobId] && !mergeMode) {
          delete taskMap[item.jobId];
        } else {
          taskMap[item.jobId] = item;
        }
        return taskMap;
      }, Object.assign({}, state));
    },
    [CLEAN_TASKS]: (state, { payload }) => ({})
  },
  {}
);

//入金申请categoryID
const JOB_TYPE_TA_DEPOSIT = 'JOB_TYPE_TA_DEPOSIT';

export const depositCategoryId = handleActions(
  {
    [GET_OBJECT_TASK_GROUPS]: (state, { payload: { categorys } }) => {
      const depositTask = categorys.find(
        category => category.jobType === JOB_TYPE_TA_DEPOSIT
      );
      console.log('depositTask', depositTask);
      return (depositTask && depositTask.value) || state;
    }
  },
  ''
);

export const categoryIdDetailMap = handleActions(
  {
    [GET_OBJECT_TASK_GROUPS]: (state, { payload: { categorys } }) => {
      return categorys.reduce((map, category) => {
        if (!category.categoryId && category.value === 'all') {
          map['all'] = category;
        } else {
          map[category.categoryId] = category;
        }
        return map;
      }, {});
    }
  },
  {}
);

export const taskType = handleActions(
  {
    [UPDATE_TASK_OBJECT]: (state, { payload }) => {
      setSessionStorageItem({ [TASK_TYPE_KEY]: payload.taskType });
      return payload.taskType;
    }
  },
  ''
);

export const taskId = handleActions(
  {
    [UPDATE_TASK_OBJECT]: (state, { payload }) => payload.itemId
  },
  ''
);

export const userAgentColumns = handleActions(
  {
    [GET_USER_AGENT_FORM_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

export const taRight = handleActions(
  {
    [GET_TA_RIGHT]: (state, { payload }) => payload
  },
  ''
);

export const isAdaptOn = handleActions(
  {
    [GET_IS_ADAPT_ON]: (state, { type, payload }) => payload
  },
  false
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);
