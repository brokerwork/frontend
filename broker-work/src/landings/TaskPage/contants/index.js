import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';

export const TASK_BOARD_ALL = 'BOARD_STATE_ALL';
export const TASK_BOARD_TODO = 'BOARD_STATE_PROCESSING';
export const TASK_BOARD_COMPLETED = 'BOARD_STATE_FINISH';
export const TASK_BOARD_CLOSED = 'BOARD_STATE_REFUSE';
export const TASK_BOARD_SUBMIT = 'BOARD_STATE_WAITE_CLAIM';
export const TASK_BOARD_CLAIMED = 'BOARD_STATE_TODO';

// 审批人类型 角色/人员
export const PARTICIPANT_TYPE = {
  ROLE: 'PARTICIPANT_TYPE_ROLE', // 角色
  USER: 'PARTICIPANT_TYPE_USER' // 人员
};

// 步骤类型 审计/抄送
export const STEP_TYPE = {
  AUDIT: 'STEP_TYPE_AUDIT', // 审计
  SEND: 'STEP_TYPE_SEND', // 抄送
  START: 'STEP_TYPE_START'
};

// 任务状态可选项
export const TASK_BOARDS = [
  { value: TASK_BOARD_ALL, label: i18n['task.task_board.all'] },
  { value: TASK_BOARD_TODO, label: i18n['task.task_board.todo'] },
  { value: TASK_BOARD_SUBMIT, label: i18n['task.task_board.submited'] },
  { value: TASK_BOARD_CLAIMED, label: i18n['task.task_board.claimed'] },
  { value: TASK_BOARD_COMPLETED, label: i18n['task.task_board.completed'] },
  { value: TASK_BOARD_CLOSED, label: i18n['task.task_board.closed'] }
];

// 任务可见状态
export const VIEW_TYPE = {
  VIEW: 'VIEW_TYPE_CAN_VIEW', // 只可查看，不允许操作
  CLAIM: 'VIEW_TYPE_CAN_CLAIM', // 等待认领
  PROCESS: 'VIEW_TYPE_CAN_PROCESS', // 处理中
  FINISH: 'VIEW_TYPE_CAN_FINISH', // 任务结束视图，不允许操作
  REFUSE: 'VIEW_TYPE_CAN_REFUSE' // 拒绝视图,不允许操作
};

// 审批状态
export const approveOptions = [
  { value: 'done', label: i18n['task.search.approve.done'] },
  { value: 'undo', label: i18n['task.search.approve.undo'] }
];
// 任务类型
export const TASK_TYPES = {
  TA: 'TA', // trader任务
  AGENCY: 'AGENCY' // 代理任务
};

// 是否有进入设置页面 或者显示任务详细的编辑按钮的 权限
export const allowsSetting = (userRights, taskType) => {
  if (taskType === TASK_TYPES.TA) {
    return !!userRights['TASK_TRADER_SET'];
  }
  if (taskType === TASK_TYPES.AGENCY) {
    return !!userRights['TASK_IB_SET'];
  }
  return false;
};

// export const TASK_STATE_SUBMITED = 'Submited';
export const TASK_STATE_SUBMITED = TASK_BOARD_SUBMIT;

export const TASK_TYPE_KEY = 'TASK_TYPE_KEY';
export const SEARCH_TYPES = {
  DEFAULT: [
    {
      label: i18n['task.object_detail.search_types.tw_user_name'],
      value: 'twUserName'
    },
    {
      label: i18n['task.object_detail.search_types.account_id'],
      value: 'accountId'
    },
    {
      label: i18n['task.object_detail.search_types.processor'],
      value: 'processor'
    }
  ],
  JOB_TYPE_AGENCY_REGISTER: [
    {
      label: i18n['task.object_detail.search_types.processor'],
      value: 'processor'
    },
    { label: i18n['task.object_detail.search_types.phone'], value: 'phone' },
    { label: i18n['task.object_detail.search_types.email'], value: 'email' }
  ],
  JOB_TYPE_AGENCY_WITHDRAW: [
    {
      label: i18n['task.object_detail.search_types.processor'],
      value: 'processor'
    },
    {
      label: i18n['task.object_detail.search_types.applyName'],
      value: 'applyName'
    },
    {
      label: i18n['task.object_detail.search_types.accountId'],
      value: 'accountId'
    }
  ]
};

// 任务时间类型
export const TASK_TIME_SEARCH_TYPE = [
  { label: i18n['task.object_detail.create_time'], value: 'applayTime' },
  { label: i18n['task.object_detail.modify_time'], value: 'ModifyTime' }
];

//serverkey to name

export const SERVER_KEY_MAP = {
  MT4: 'MT4',
  MT5: 'MT5',
  CTRADER: 'cBroker'
};

export const TELEGRAPHIC_DEPOSIT_KEY = '999999';

export const CUSTOMER_FIELDS_TO_ACCOUNT_OWNER = [
  'phones',
  'email',
  'standbyTelephone',
  'im'
];
// 高级搜索条件
export const ADVANCED_SEARCH_CONDITIONS = [
  {
    label: i18n['customer.advanced_search.conditions.eq'],
    value: 'EQ'
  },
  { label: i18n['customer.advanced_search.conditions.eq'], value: 'IN' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NEQ' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NIN' },
  { label: i18n['customer.advanced_search.conditions.regex'], value: 'REGEX' },
  { label: i18n['customer.advanced_search.conditions.gt'], value: 'GT' },
  { label: i18n['customer.advanced_search.conditions.lt'], value: 'LT' },
  {
    label: i18n['customer.advanced_search.conditions.between'],
    value: 'BETWEEN'
  }
];

const createTimetRanges = {
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

export const ADVANCED_SEARCH_CONFIG = {
  conditionKey: 'opt', //条件的key
  arraySplit: '@#$', //数组分隔符
  dateSplit: '~' // 时间分隔符
};

// console.log('TASK_BOARDS', JSON.stringify(TASK_BOARDS));

// 高级搜索
export const ADVANCED_SEARCH_TYPE_DEFAULT = [
  {
    label: i18n['task.object_detail.task_group'],
    value: 'categoryId',
    fieldType: 'select',
    conditions: ['EQ'],
    mainFilter: true
  },
  {
    label: i18n['task.export.label.task_board'],
    value: 'taskBoard',
    fieldType: 'select',
    optionList: TASK_BOARDS,
    conditions: ['EQ'],
    keepOpen: true
  },
  {
    label: i18n['task.object_detail.create_time'],
    value: 'CreateTime',
    fieldType: 'date',
    conditions: ['EQ'],
    rangeConditions: true,
    additions: { ranges: createTimetRanges, dateLimit: { months: 3 } },
    keepOpen: true
  },
  {
    label: i18n['task.object_detail.modify_time'],
    value: 'ModifyTime',
    fieldType: 'date',
    conditions: ['EQ'],
    rangeConditions: true,
    filterTaskBoards: [TASK_BOARD_CLOSED, TASK_BOARD_COMPLETED]
  },
  {
    label: i18n['task.object_detail.search_types.processor'],
    value: 'processor',
    fieldType: 'user',
    conditions: ['EQ'],
    additions: { usePubUserId: true }
    // filterJobType: 'JOB_TYPE_TA_DEPOSIT'
  },
  {
    label: i18n['task.search.approve'],
    value: 'approve',
    fieldType: 'select',
    conditions: ['EQ'],
    optionList: approveOptions
  },
  {
    label: i18n['task.search.cctome'],
    value: 'cctome',
    fieldType: 'select',
    conditions: ['EQ'],
    optionList: [
      { value: 'yes', label: i18n['task.search.cctome.yes'] }
    ]
  }
];

const ADVANCED_SEARCH_TYPE_TA = [
  ...ADVANCED_SEARCH_TYPE_DEFAULT,
  {
    label: i18n['task.object_detail.search_types.tw_user_name'],
    value: 'twUserName',
    fieldType: 'input',
    conditions: ['EQ']
  },
  {
    label: i18n['task.export.label.pay_status'],
    value: 'payStatus',
    fieldType: 'select',
    conditions: ['EQ'],
    optionList: [
      { value: '', label: i18n['task.task_board.all'] },
      {
        value: 'Finished',
        label: i18n['task.form.pay_status.Finished']
      },
      {
        value: 'Pending',
        label: i18n['task.form.pay_status.Pending']
      }
    ],
    filterJobType: 'JOB_TYPE_TA_DEPOSIT'
  },
  {
    label: i18n['task.object_detail.search_types.orderNo'],
    value: 'payOrderNo',
    fieldType: 'input',
    conditions: ['EQ'],
    filterJobType: 'JOB_TYPE_TA_DEPOSIT'
  },
  {
    label: i18n['task.object_detail.search_types.account_id'],
    value: 'accountId',
    type: 'input',
    conditions: ['EQ']
  }
];

export const ADVANCED_SEARCH_TYPE = {
  TA: ADVANCED_SEARCH_TYPE_TA,
  JOB_TYPE_TA_RESET_TRADE: [
    ...ADVANCED_SEARCH_TYPE_TA,
    {
      label: i18n['task.object_detail.search_types.email'],
      value: 'email',
      type: 'email',
      conditions: ['EQ']
    },
    {
      label: i18n['task.object_detail.search_types.phone'],
      value: 'phone',
      type: 'phone',
      conditions: ['EQ']
    }
  ].filter(item => item.value !== 'accountId'),
  JOB_TYPE_AGENCY_REGISTER: [
    ...ADVANCED_SEARCH_TYPE_DEFAULT,
    {
      label: i18n['task.object_detail.search_types.phone'],
      value: 'phone',
      type: 'phone',
      conditions: ['EQ']
    },
    {
      label: i18n['task.object_detail.search_types.email'],
      value: 'email',
      type: 'email',
      conditions: ['EQ']
    }
  ],
  JOB_TYPE_AGENCY_WITHDRAW: [
    ...ADVANCED_SEARCH_TYPE_DEFAULT,
    {
      label: i18n['task.object_detail.search_types.applyName'],
      value: 'twUserName',
      type: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['task.object_detail.search_types.accountId'],
      value: 'accountId',
      type: 'input',
      conditions: ['EQ']
    }
  ]
};
