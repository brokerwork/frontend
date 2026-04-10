/**
 * 自定义流程设置页面
 * @file ObjectSettingProcess/control.js
 * @author david
 */

import { createAction, handleActions } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import keyTransfer from 'utils/keyTransfer';
import _ from 'lodash';
import { PARTICIPANT_TYPE } from '../../contants';

const TASK_PROCESS = 'TASK_PROCESS_';
const GET_DATA = `${TASK_PROCESS}GET_DATA`;
const REMOVE_DATA = `${TASK_PROCESS}REMOVE_DATA`;
const ADD_DATA = `${TASK_PROCESS}ADD_DATA`;
const UPDATE_DATA = `${TASK_PROCESS}UPDATE_DATA`;
const PUBLIC_PROCESS = `${TASK_PROCESS}PUBLIC_PROCESS`;
const GET_OBJECT_INFO = `${TASK_PROCESS}GET_OBJECT_INFO`;

// action集合, 方便外部引用
export const actions = {};
// reducer集合, 方便外部引用
export const reducers = {};

// 字段转换规则, 后端接口变动为减少修改特意做个映射
const PROCESS_KEY_TRANSFER = [
  { from: 'participantSet', to: 'participant' },
  { from: 'mtGroupSet', to: 'mtGroups' },
  { from: 'groupSet', to: 'groups' },
  { from: 'info', to: 'roleName' }
];

const PROCESS_KEY_TRANSFER_REVERSE = PROCESS_KEY_TRANSFER.map(item => {
  const [from, to] = [item.to, item.from];
  return {
    ...item,
    from,
    to
  };
});
PROCESS_KEY_TRANSFER_REVERSE.push(
  { remove: 'options' },
  { remove: 'disable' },
  {
    from: 'mtGroupsMap',
    to: 'mtGroupSet',
    handle: function(data) {
      const arr = [];
      for (let k in data) {
        const item = data[k];
        if (item.disable) {
          item.groups = [];
        }
        arr.push(data[k]);
      }
      return arr;
    }
  }
);

//获取项目详细信息
const getObjectInfo = createAction(GET_OBJECT_INFO, itemId => {
  return get({ url: `/v1/tasks/item/${itemId}/tasksItem` }).then(res => {
    if (!res.result) return res;
    const item = _.get(res, 'data.item', {});
    const d = {
      ...res.data,
      ...item
    };
    return {
      ...res,
      data: d
    };
  });
});
actions['getObjectInfo'] = getObjectInfo;

const objectInfo = handleActions(
  {
    [GET_OBJECT_INFO]: (_, { payload }) => payload
  },
  {}
);
reducers['objectInfo'] = objectInfo;

// 获取list数据
const getProcessListData = createAction(GET_DATA, categoryId => {
  return get({
    url: `/v1/tasks/item/${categoryId}/tasksStep`
  }).then(res => {
    const { result, data } = res;
    if (!result || !Array.isArray(data)) return res;
    keyTransfer({ data, rule: PROCESS_KEY_TRANSFER });
    return {
      ...res,
      data
    };
  });
});
actions['getProcessListData'] = getProcessListData;

// 删除数据
const removeData = createAction(REMOVE_DATA, (index, data) => {
  const d = data.concat();
  d.splice(index, 1);
  return Promise.resolve({
    result: true,
    data: d
  });
});
actions['removeData'] = removeData;

// 添加数据
const addData = createAction(ADD_DATA, (index, item, data) => {
  const d = data.concat();
  // -1表示在第一步之前添加步骤
  if (index === -1) {
    d.unshift(item);
  } else {
    // 在第index个元素之后插入item
    d.splice(index + 1, 0, item);
  }
  // 返回一个Promise, 是因为在页面上调用的时候, 通过then方法可以回调关闭card的方法
  // 同时也为以后做添加即保存做预留
  return Promise.resolve({
    result: true,
    data: d
  });
});
actions['addData'] = addData;

// 更新数据
const updateData = createAction(UPDATE_DATA, (index, item, data) => {
  const d = data.concat();
  d[index] = item;
  return Promise.resolve({
    result: true,
    data: d
  });
});
actions['updateData'] = updateData;

// list数据
const list = handleActions(
  {
    [GET_DATA]: (_, { payload }) => payload,
    [ADD_DATA]: (_, { payload }) => payload,
    [REMOVE_DATA]: (_, { payload }) => payload,
    [UPDATE_DATA]: (_, { payload }) => payload
  },
  []
);
reducers['list'] = list;

// 提交数据
const publicProcess = createAction(PUBLIC_PROCESS, (categoryId, data) => {
  // 数据结构还原
  let d = _.cloneDeep(data);
  keyTransfer({ data: d, rule: PROCESS_KEY_TRANSFER_REVERSE });
  // 对每个步骤里的stepNo重新排序
  d.forEach((item, index) => {
    item['stepNo'] = index + 1;
  });
  return post({
    url: `/v1/tasks/item/${categoryId}/edit/tasksStep`,
    data: d
  });
});
actions['publicProcess'] = publicProcess;
