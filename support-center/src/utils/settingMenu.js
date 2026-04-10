import i18n from 'utils/i18n';

export const MENUS = [
  {
    // 消息设置
    label: i18n['settings.left_menu.message_setting'],
    icon: 'envelope',
    category: 'message',
    right: 'SYSTEM_MESSAGE',
    submenus: [
      // 消息模板设置
      {label: i18n['settings.left_menu.message_setting.sub_menu.message_template'], link: '/message/template', right: 'SYSTEM_MESSAGE_TP'}
    ]
  },
  {
    // 操作日志
    label: i18n['settings.left_menu.log'],
    icon: 'book', 
    category: 'log',
    right: 'SYSTEM_LOG',
    submenus: [
      // 基础模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.basic_log'], link: '/log/basic', right: 'SYSTEM_LOG_BASIC'},
      // 用户模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.user_log'], link: '/log/user', right: 'SYSTEM_LOG_USER'},
      // 消息模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.message_log'], link: '/log/message', right: 'SYSTEM_LOG_MESSAGE'},
      // 客户模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.customer_log'], link: '/log/customer', right: 'SYSTEM_LOG_CUSTOMER'},
      // 账户模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.account_log'], link: '/log/account', right: 'SYSTEM_LOG_ACCOUNT'},
      // 系统模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.system_log'], link: '/log/system', right: 'SYSTEM_LOG_SYSTEM'},
      // 任务模块操作日志
      {label: i18n['settings.left_menu.log.sub_menu.task_log'], link: '/log/task', right: 'SYSTEM_LOG_TASK'},
    ]
  },
  {
    // 用户管理
    label: i18n['settings.left_menu.user_setting'],
    icon: 'group', 
    category: 'user',
    right: 'SYSTEM_USER',
    submenus: [
      // 角色权限设置
      {label: i18n['settings.left_menu.user_setting.sub_menu.role_setting'], link: '/user/roleSetting', right: 'SYSTEM_USER_ROLEAUTH'},
      // 推广链接设置
      {label: i18n['settings.left_menu.user_setting.sub_menu.link_setting'], link: '/user/linkSetting', right: 'SYSTEM_USER_LINK'}
    ]
  },
  {
    // 账户管理 
    label: i18n['settings.left_menu.account_setting'],
    icon: 'list-alt',
    category: 'account',
    right: 'SYSTEM_ACCOUNT',
    submenus: [
      // 账户组设置
      {label: i18n['settings.left_menu.account_setting.sub_menu.account_group_setting'], link: '/account/accountsetting', right: 'SYSTEM_ACCOUNT_GROUP'}
    ]
  },
  {
    // 返佣规则设置
    label: i18n['settings.left_menu.rebate_setting'],
    icon: 'money',
    category: 'rebate',
    right: 'SYSTEM_REBATE',
    submenus: [
      // 返佣层级设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.user_hierarchy_setting'], link: 'rebate/levelSetting'},
      // 品种组设置
      {label: i18n['settings.left_menu.rebate_setting.sub_menu.symbol_group_setting'], link: 'rebate/symbolGroupSetting'},
      // 多层代理模式设置
      {label: i18n['settings.left_menu.rebate_setting.sub_menu.multi_agent_setting'], link: 'rebate/multiAgent', mode: 'MULTI_AGENT'},
      // 分销代理模式设置
      {label: i18n['settings.left_menu.rebate_setting.sub_menu.distribution_setting'], link: 'rebate/distribution', mode: 'DISTRIBUTION'},
      // 交易返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.transaction_rule_setting'], link: 'rebate/transactionRuleSetting'},
      // 入金返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.deposit_rule_setting'], link: 'rebate/depositRuleSetting'},
      // 盈利分成返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.profit_rule_setting'], link: 'rebate/profitRuleSetting'}
      // 分销返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.distribution_rule_setting'], link: 'rebate/distribution/distributionRuleSetting'}
    ]
  }
];
