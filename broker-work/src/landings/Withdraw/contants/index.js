import i18n from 'utils/i18n';

export const TASK_BOARD_ALL = 'All';
export const TASK_BOARD_TODO = 'TODO';
export const TASK_BOARD_COMPLETED = 'Completed';
export const TASK_BOARD_CLOSED = 'Closed';
export const TASK_BOARD_SUBMIT = 'Submit';
export const TASK_BOARD_CLAIMED = 'Claimed';

export const TASK_STATE_SUBMITED = 'Submited';

export const TASK_BOARDS = [
  { value: TASK_BOARD_ALL, label: i18n['task.task_board.all'] },
  { value: TASK_BOARD_TODO, label: i18n['task.task_board.todo'] },
  { value: TASK_BOARD_SUBMIT, label: i18n['task.task_board.submited'] },
  { value: TASK_BOARD_CLAIMED, label: i18n['task.task_board.claimed'] },
  { value: TASK_BOARD_COMPLETED, label: i18n['task.task_board.completed'] },
  { value: TASK_BOARD_CLOSED, label: i18n['task.task_board.closed'] }
];

export const TASK_TYPES = {
  TA: 'TA',
  AGENCY: 'AGENCY'
};

export const SEARCH_TYPES = {
  TA: [
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
  AGENCY: [
    {
      label: i18n['task.object_detail.search_types.processor'],
      value: 'processor'
    },
    { label: i18n['task.object_detail.search_types.phone'], value: 'phone' },
    { label: i18n['task.object_detail.search_types.email'], value: 'email' }
  ]
};

// 任务时间类型
export const TASK_TIME_SEARCH_TYPE = [
  { label: i18n['task.object_detail.create_time'], value: 'CreateTime' },
  { label: i18n['task.object_detail.modify_time'], value: 'ModifyTime' }
];

//银行🇭字段
export const BANK_INFO_FIELD_KEYS = [
  'bankAccountName',
  'bankAccountNumber',
  'bankBranchName',
  'bankName',
  'swift',
  'bankAddress',
  'bankId',
  'currentTotalAmount'
];
