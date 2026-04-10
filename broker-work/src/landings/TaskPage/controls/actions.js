import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import actionDebounce from 'utils/actionDebounce';
import _ from 'lodash';
import i18n from 'utils/i18n';
import { getItem as getSessionStorageItem } from 'utils/sessionStorageShare';
import { TASK_TYPE_KEY, TASK_TYPES } from '../contants';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'TASK_';
export const GET_OBJECTS = `${PRE_FIX}GET_OBJECTS`;
export const GET_OBJECT_TASK_GROUPS = `${PRE_FIX}GET_OBJECT_TASK_GROUPS`;
export const GET_TASK_GROUP_TASKS = `${PRE_FIX}GET_TASK_GROUP_TASKS`;
export const GET_THE_TASK = `${PRE_FIX}GET_THE_TASK`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const SELECT_TASK = `${PRE_FIX}SELECT_TASK`;
export const CLEAN_TASKS = `${PRE_FIX}CLEAN_TASKS`;
export const BATCH_REJECT_TASK = `${PRE_FIX}BATCH_REJECT_TASK`;
export const BATCH_CLAIM_TASK = `${PRE_FIX}BATCH_CLAIM_TASK`;
export const REFRESH_TASKS = `${PRE_FIX}REFRESH_TASKS`;
export const UPDATE_TASK_OBJECT = `${PRE_FIX}UPDATE_TASK_OBJECT`;
export const UPDATE_TASK_ID = `${PRE_FIX}UPDATE_TASK_ID`;
export const GET_USER_AGENT_FORM_COLUMNS = `${PRE_FIX}GET_USER_AGENT_FORM_COLUMNS`;
export const GET_TASKS = `${PRE_FIX}GET_TASKS`;
export const GET_TA_RIGHT = `${PRE_FIX}GET_TA_RIGHT`;
export const GET_IS_ADAPT_ON = `${PRE_FIX}GET_IS_ADAPT_ON`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const EXPORT_TASK = `${PRE_FIX}EXPORT_TASK`;
export const UPDATE_FUZZY_SEARCH_TEXT = `${PRE_FIX}UPDATE_FUZZY_SEARCH_TEXT`;
export const VERIFY_IDENTITY = `${PRE_FIX}VERIFY_IDENTITY`;
export const TASK_SYNC_GROUP = `${PRE_FIX}TASK_SYNC_GROUP`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取项目列表
export const getObjects = createAction(
  GET_OBJECTS,
  actionDebounce(() =>
    get({
      url: '/v1/tasks/view/tasksItemTab'
    }).then(res => {
      const { result, data } = res;
      if (!result || !Array.isArray(data)) return res;
      const d = data.map(item => {
        item.taskType = item.itemType;
        item.todoCount = item.jobNum;
        return item;
      });
      return {
        ...res,
        data: d
      };
    })
  )
);

// 领取任务
export const getTheTask = createAction(GET_THE_TASK, (taskId, stepNum) =>
  get({
    url: `/v1/tasks/process/${taskId}/${stepNum}/claimTasksJob`
  })
);

// 获取项目任务组列表
export const getObjectTaskGroups = createAction(
  GET_OBJECT_TASK_GROUPS,
  actionDebounce(objectId => (dispatch, getState) => {
    // 避免大的修改, 这里从getState中获取objectList数据, 以兼容接口修改后, 没有传回当前项目详情数据
    const state = getState();
    const objectList = _.get(state, 'taskmgmt.object_list', []);
    const objectDetails = _.get(state, 'taskmgmt.objectDetails', {});
    let item = { ...objectDetails };
    objectList.some(i => {
      if (i.itemId === objectId) {
        item = { ...i };
        return true;
      }
    });
    return get({
      url: `/v1/tasks/view/${objectId}/tasksCategoryTab`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      const { data = [] } = res;
      const __arr = data.map(item => {
        return {
          label:
            i18n[
              `task.object_setting.task_setting.task_group_type.${item.jobType}`
            ],
          value: item.jobType,
          jobType: item.jobType,
          todoCount: item.jobNum,
          categoryId: item.jobType
        };
      });
      const taskType = getSessionStorageItem(TASK_TYPE_KEY);
      if (taskType === TASK_TYPES.TA) {
        __arr.unshift({
          label: i18n['task.object_setting.task_setting.task_group_type.ALL'],
          value: 'all',
          field: 'categoryId'
        });
      }
      const p = Promise.resolve({
        ...res,
        data: {
          ...item,
          categorys: __arr
        }
      });
      dispatch({ type: GET_OBJECT_TASK_GROUPS, payload: p });
      return p;
    });
  }),
  () => ({
    noMask: true
  })
);

// 搜索参数修改
export const modifyParams = createAction(MODIFY_PARAMS, data => data);

// 由于接口变动, 需要对搜索字段做映射, 以减少对其他地方的修改
const fieldTransform = searchParams => {
  const { fuzzyVal, advanceConditions = [] } = searchParams;
  const advanceConditionsTransform = advanceConditions.map(item => {
    const { field, value } = item;
    let key = field;
    if (key === 'taskBoard') {
      key = 'boardState';
    }
    if (field === 'CreateTime') {
      key = 'applayTime';
    }
    if (field === 'categoryId') {
      key = 'jobType';
    }
    return { field: key, value };
  });
  const searchData = {
    ...searchParams,
    jobType: searchParams.categoryId, // 后端接口变动 转换 categoryId 的值到jobType, 为了避免更大的改动造成不可预知的bug
    advanceConditions: advanceConditionsTransform,
    fuzzyVal: (fuzzyVal && fuzzyVal.value) || fuzzyVal
  };
  delete searchData.categoryId;
  return searchData;
};

//获取任务组下的列表数据
export const getTasks = createAction(GET_TASKS, searchParams => dispatch => {
  const { itemId } = searchParams;
  const data = fieldTransform(searchParams);
  const request = post({
    url: `/v1/tasks/view/${itemId}/tasksViewTable`,
    data
  }).then(res => {
    if (res.result) {
      dispatch(updateUpdateTime(res.time));
    }
    return res;
  });
  dispatch({
    type: GET_TASKS,
    payload: request
  });
});
// 获取任务组下的任务列表
export const getTaskGroupTasks = createAction(
  GET_TASK_GROUP_TASKS,
  actionDebounce(
    (searchParams, ignoreCategory, ignoreCountTodo) => dispatch => {
      if (searchParams.itemId) {
        dispatch(getTasks(searchParams));
        if (!ignoreCountTodo) dispatch(getObjects());
        if (!ignoreCategory) dispatch(getObjectTaskGroups(searchParams.itemId));
      }
    }
  )
);

//选择任务(obj/ [obj])
export const selectTask = createAction(SELECT_TASK, (task, mergeMode) => ({
  task,
  mergeMode
}));

//清空已选任务
export const cleanTasks = createAction(CLEAN_TASKS);

//批量拒绝
export const batchRejectTask = createAction(
  BATCH_REJECT_TASK,
  ({ selectedTasks, reason, sendEmail }) => {
    const data = [];
    for (let k in selectedTasks) {
      const item = selectedTasks[k];
      data.push({
        jobId: item.jobId,
        stepNum: item.nowStep,
        reason,
        sendEmail
      });
    }
    return post({
      url: '/v1/tasks/process/batch/PROCESS_TYPE_REFUSE/processTasksJob',
      data
    });
  }
);

//批量认领
export const batchClaimTask = createAction(
  BATCH_CLAIM_TASK,
  (selectedTasks = {}) => {
    const data = [];
    for (let k in selectedTasks) {
      const item = selectedTasks[k];
      data.push({
        jobId: item.jobId,
        stepNum: item.nowStep
      });
    }
    return post({
      url: '/v1/tasks/process/batch/PROCESS_TYPE_CLAIM/processTasksJob',
      data
    });
  }
);

export const refreshTasks = createAction(REFRESH_TASKS, params => dispatch => {
  dispatch(getTaskGroupTasks(params));
  dispatch(cleanTasks());
});

export const updateTaskObject = createAction(UPDATE_TASK_OBJECT, obj => obj);

// 获取代理任务自定义字段
export const getUserAgentFormColumns = createAction(
  GET_USER_AGENT_FORM_COLUMNS,
  () =>
    get({
      url: '/v1/tenants/metadata/form-field/list',
      data: {
        tableName: 't_user_agent'
      }
    })
);

export const getTaRight = createAction(GET_TA_RIGHT, () =>
  get({
    url: '/v1/right/listTopRights'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    // 敏感信息权限判断
    const isTaRight = findTaRight(res.data);
    return Promise.resolve({
      ...res,
      data: isTaRight
    });
  })
);

//获得sc是否开启适应性测试题
export const getIsAdaptOn = createAction(GET_IS_ADAPT_ON, () =>
  get({
    url: '/v1/tenants/metadata/switch/question'
  })
);

function findTaRight(tree) {
  const KEY = 'TAUSER_ENABLE';
  return !!(
    tree &&
    tree.find(item => {
      return item.entityNo === KEY || findTaRight(item.children);
    })
  );
}

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

export const exportTask = createAction(
  EXPORT_TASK,
  params => {
    const { itemId } = params;
    const p = fieldTransform(params);
    return post({
      url: `/v1/tasks/view/${itemId}/export`,
      data: p
    });
  },
  () => ({
    noMask: true
  })
);

export const updateFuzzySearchText = createAction(
  UPDATE_FUZZY_SEARCH_TEXT,
  text => text
);

export const verifyIdentity = createAction(
  VERIFY_IDENTITY,
  (jobId, verifies) =>
    all(
      verifies.map(item => {
        const obj = { ...item };
        console.log('fwobj', obj);
        for (let i in obj) {
          if (Array.isArray(obj[i])) {
            obj[i] = obj[i][0];
          }
        }
        return post({
          url: `/v1/tasks/job/${jobId}/verification/identity`,
          data: obj
        });
      })
    )
      .then(res => {
        if (!res.result) return Promise.resolve(res);
        return Promise.resolve({
          ...res,
          data: verifies.reduce((obj, item, i) => {
            const item1 = { ...item };
            for (let i in item1) {
              if (Array.isArray(item1[i])) {
                item1[i] = item1[i][0];
              }
            }
            const temp = {
              ...item1,
              checkState: res.data && res.data[i] === 'OW_TENANT_0',
              checkResult: res.data && res.data[i],
              checkTime: new Date()
            };
            obj[item.type] = temp;
            return obj;
          }, {})
        });
      })
      .catch(err => {
        return Promise.resolve({
          result: false,
          mcode: err
        });
      }),
  () => ({
    fallback: {}
  })
);
