import { createAction, handleActions } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import { TASK_TYPES, STEP_TYPE } from '../../contants';

const PRE_FIX = 'TASK_STAFF_SELECT_MODAL_';
const GET_OPTIONS_DATA = `${PRE_FIX}GET_OPTIONS_DATA`;
const RESET = `${PRE_FIX}RESET`;
const SET_SELECTED_STAFF = `${PRE_FIX}SET_SELECTED_STAFF`;
const SUBMIT = `${PRE_FIX}SUBMIT`;

// action集合, 方便外部引用
export const actions = {};
// reducer集合, 方便外部引用
export const reducers = {};

// 可选人员, 角色等信息
const options = handleActions(
  {
    [GET_OPTIONS_DATA]: (_, { payload }) => {
      return payload;
    },
    [RESET]: () => []
  },
  []
);
reducers['options'] = options;

// 搜索用户
const searchUser = (key, type, stepType, itemType) => {
  const condition = [
    {
      condition: 'EQ',
      field: 'nameOrEntityNo',
      value: key
    },
    {
      condition: 'EQ',
      field: 'excludeIbRole',
      value: stepType === STEP_TYPE.SEND ? '1' : '0'
    }
  ];
  if (stepType !== STEP_TYPE.SEND) {
    condition.push({
      condition: 'EQ',
      field: 'right',
      value:
        itemType === TASK_TYPES.AGENCY ? 'TASK_IB_DEAL' : 'TASK_TRADER_DEAL'
    });
  }
  return post({
    url: `/v2/user/search/simpleUser`,
    data: {
      condition
    }
  }).then(res => {
    const { result, data } = res;
    if (!result) return res;
    const d = data.map(item => {
      return {
        ...item,
        label: item.name,
        value: item.pubUserId
      };
    });
    return {
      ...res,
      data: d
    };
  });
};

// 搜索角色
const searchRole = (type, key) => {};

// 获取可选人员, 角色等
const getOptionsData = createAction(
  GET_OPTIONS_DATA,
  (key, type, stepType, itemType) => {
    return searchUser(key, type, stepType, itemType);
  }
);
actions['getOptionsData'] = getOptionsData;

// 重置可选人员, 角色等
const reset = createAction(RESET);
actions['reset'] = reset;

// 已经选择的人员, 角色
const selectedStaff = handleActions(
  {
    [SET_SELECTED_STAFF]: (_, { payload }) => payload.staff,
    [RESET]: () => new Map()
  },
  new Map()
);
reducers['selectedStaff'] = selectedStaff;

// 可选人员列表映射, 方便取数据
const selectedStaffKeys = handleActions(
  {
    [SET_SELECTED_STAFF]: (_, { payload }) => payload.selectedKeys,
    [RESET]: () => new Set()
  },
  new Set()
);
reducers['selectedStaffKeys'] = selectedStaffKeys;

// 设置选中的人员
const setStaff = createAction(
  SET_SELECTED_STAFF,
  ({ type, item, preSelectedStaff }) => {
    let currentStaff = item;
    const staff = new Map(preSelectedStaff);
    if (currentStaff) {
      if (type === 'add') {
        staff.set(currentStaff.value, currentStaff);
      } else if (type === 'delete') {
        staff.delete(currentStaff.value);
      }
    }
    const selectedKeys = new Set();
    staff.forEach(item => {
      selectedKeys.add(item.value);
    });
    return {
      selectedKeys,
      staff
    };
  }
);
actions['setStaff'] = setStaff;

// // 提交数据
// const submit = createAction(SUBMIT, data => dispatch => {
//   dispatch(reset());
//   return Promise.resolve({
//     result: true,
//     data
//   });
// });
// actions['submit'] = submit;
