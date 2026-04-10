import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import { PARTICIPANT_TYPE } from '../contants';

// =========================================
// action constans
// =========================================
const PRE_FIX = 'TASK_SETTING_';
export const GET_OBJECT_SETTING_DETAILS = `${PRE_FIX}GET_OBJECT_SETTING_DETAILS`;
export const MODIFY_CATEGORYS_DATA = `${PRE_FIX}MODIFY_CATEGORYS_DATA`;
export const MODIFY_OBJECT_NAME = `${PRE_FIX}MODIFY_OBJECT_NAME`;
export const GET_STEP_DATA = `${PRE_FIX}GET_STEP_DATA`;
export const SAVE_STEP_DATA = `${PRE_FIX}SAVE_STEP_DATA`;
export const SAVE_DATA_TO_SERVER = `${PRE_FIX}SAVE_STEP_DATA`;
export const INITIAL_TASK_GROUP_MEMBER = `${PRE_FIX}INITIAL_TASK_GROUP_MEMBER`;
export const INITIAL_SERVER_LIST = `${PRE_FIX}INITIAL_SERVER_LIST`;
export const INITIAL_LEVERAGE_LIST = `${PRE_FIX}INITIAL_LEVERAGE_LIST`;
export const GET_CTRADERR_FORM = `${PRE_FIX}GET_CTRADERR_FORM`;
export const GET_CTRADER_USER_GROUP = `${PRE_FIX}GET_CTRADER_USER_GROUP`;
export const GET_CTRADER_CURRENCY_BY_SERVER_ID = `${PRE_FIX}GET_CTRADER_CURRENCY_BY_SERVER_ID`;
export const MODIFY_SEND_SMS = `${PRE_FIX}MODIFY_SEND_SMS`;
export const TASK_SYNC_GROUP = `${PRE_FIX}TASK_SYNC_GROUP`;
export const GET_ACCOUNT_FIELDS = `${PRE_FIX}GET_ACCOUNT_FIELDS`;

// =========================================
// actions
// =========================================

// 获取详细信息
export const getDetails = createAction(GET_OBJECT_SETTING_DETAILS, objectId => {
  return get({
    url: `/v1/tasks/item/${objectId}/tasksItem`
  }).then(res => {
    const { result, data } = res;
    if (!result) return res;
    const { categoryStepMap, categorySet: categorys } = data;
    // 接口字段改变, 做映射
    const obj = {
      ...data,
      ...data.item,
      categorys
    };
    delete obj.categorySet;
    categorys.forEach(item => {
      item.reminder = item.reminderSet;
      item.allStep = categoryStepMap[item.categoryId] || 0;
      delete item.reminderSet;
    });
    return {
      ...res,
      data: obj
    };
  });
});

export const modifyObjectName = createAction(MODIFY_OBJECT_NAME, v => v);
export const modifySendSMS = createAction(MODIFY_SEND_SMS, v => v);

// 修改审核设置
export const modifyCategorysData = createAction(
  MODIFY_CATEGORYS_DATA,
  (type, value, index) => ({ type, value, index })
);

// 获取步骤信息
export const getStepData = createAction(
  GET_STEP_DATA,
  (objectId, taskGroupId) =>
    get({
      url: `/v1/job/setting/${objectId}/${taskGroupId}/step/list`
    })
);

// 保存步骤信息
export const saveStepData = createAction(
  SAVE_STEP_DATA,
  ({ objectId, taskGroupId, stepId, data }) => {
    return post({
      url: `/v1/job/setting/${objectId}/${taskGroupId}/${stepId}/participant/edit`,
      data: data
    });
  }
);

// 初始化页面时同时加载各任务组的成员，用于提醒设置时的下拉
export const initialTaskGroupMember = createAction(
  INITIAL_TASK_GROUP_MEMBER,
  (objectId, taskGroupIds) => {
    // 接口返回的顺序有可能会与原来的不一致, 需要做个映射
    const taskGroupIdsMap = {};
    taskGroupIds.forEach((id, i) => (taskGroupIdsMap[id] = i));

    return get({
      url: `/v1/tasks/item/${objectId}/reminderSet`
    }).then(res => {
      const { result, data } = res;
      if (!result || !Array.isArray(data)) return res;
      const options = [];
      data.forEach(item => {
        const { reminderSet, categoryId } = item;
        const index = taskGroupIdsMap[categoryId];
        if (!Array.isArray(reminderSet) || index === void 0) return;
        const op = reminderSet.map(reminder => {
          return {
            name: reminder.name,
            participantType: reminder.participantType,
            userId: reminder.userId,
            value: reminder.userId,
            label: reminder.name
          };
        });
        options[index] = op;
      });
      return { ...res, data: options };
    });
  }
);

// 初始化杠杆选项
export const initialLeverageList = createAction(INITIAL_LEVERAGE_LIST, () =>
  all(
    [
      get({
        url: '/v1/tenants/metadata/field/option/leverage',
        header: {
          'x-api-vendor': 'MT4'
        }
      }),
      get({
        url: '/v1/tenants/metadata/field/option/leverage',
        header: {
          'x-api-vendor': 'MT5'
        }
      }),
      get({
        url: '/v1/tenants/metadata/field/option/leverage',
        header: {
          'x-api-vendor': 'CTRADER'
        }
      }),
      get({
        url: '/v1/tenants/metadata/field/option/maxLeverage',
        header: {
          'x-api-vendor': 'CTRADER'
        }
      })
    ],
    ['mt4', 'mt5', 'ct', 'ctMax']
  )
);

// 初始化服务器下拉列表信息
export const initialServerList = createAction(INITIAL_SERVER_LIST, () =>
  all(
    [
      get({ url: '/v1/report/setting/serverGroupsQuery?vendor=MT4' }),
      get({ url: '/v1/report/setting/serverGroupsQuery?vendor=MT5' }),
      get({ url: '/v1/report/setting/serverGroupsQuery?vendor=CTRADER' })
    ],
    ['mt4', 'mt5', 'ct']
  )
);

// 保存 项目设置数据
export const saveDataToServer = createAction(
  SAVE_DATA_TO_SERVER,
  (objectId, data) => {
    const { categorys } = data;
    if (Array.isArray(categorys)) {
      categorys.forEach(item => {
        item.reminderSet = item.reminder;
        delete item.reminder;
      });
      data.categorySet = categorys;
      _.set(data, 'item.itemName', data.itemName);
      delete data.categorys;
    }
    return post({
      url: `/v1/tasks/item/${objectId}/edit/tasksItem`,
      data: data
    });
  }
);

// 获取开户信息自定义字段
export const getCtraderForm = createAction(GET_CTRADERR_FORM, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_account_cbroker'
    }
  })
);

export const getCtraderUserGroup = createAction(GET_CTRADER_USER_GROUP, () => {
  //获取
  return get({
    url: '/v1/account/manage/userGroup/info'
  });
});

export const taskSyncGroup = createAction(
  TASK_SYNC_GROUP,
  itemId => dispatch => {
    return dispatch({
      type: TASK_SYNC_GROUP,
      payload: post({
        url: `/v1/job/setting/${itemId}/synRefresh`
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        dispatch(getDetails(itemId));
        dispatch(initialServerList());
        return Promise.resolve(res);
      })
    });
  }
);

export const getCtraderCurrencyByServerId = createAction(
  GET_CTRADER_CURRENCY_BY_SERVER_ID,
  serverId => {
    //获取
    return get({
      url: '/v1/account/dropdown/currency',
      header: {
        'x-api-vendor': 'CTRADER',
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (res.result) {
        return Promise.resolve({
          ...res,
          data: {
            serverId: serverId,
            data: res.data
          }
        });
      } else {
        return Promise.resolve(res);
      }
    });
  }
);

//获取账户所有人资料的字段
export const getAccountFields = createAction(GET_ACCOUNT_FIELDS, () =>
  Promise.all([
    get({
      url: '/v1/product/account/properties/fields'
    }),
    get({
      url: '/v1/product/account/properties'
    })
  ]).then(([fieldsRes, configRes]) => {
    if (!fieldsRes.result || !configRes.result) {
      return fieldsRes;
    }
    const fieldsList = fieldsRes.data || [];
    const { type, fieldIds = [] } = configRes.data;
    let data = [];
    switch (type) {
      case 'ALL_PERMIT': //全部允许
        data = fieldsList.concat();
        break;
      case 'SECTION_PERMIT': //部分允许
        data = fieldsList.filter(el => fieldIds.includes(el.key));
        break;
      default:
        //部分不允许
        data = fieldsList.filter(el => !fieldIds.includes(el.key));
        break;
    }
    data = data.map(el => ({
      label: el.name,
      value: el.key
    }));
    return { result: true, data };
  })
);
