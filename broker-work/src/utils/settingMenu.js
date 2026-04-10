import i18n from 'utils/i18n';
export const MENUS = [
  {
    // 消息设置
    label: i18n['settings.left_menu.message_setting'],
    icon: 'email',
    category: 'message',
    right: 'SYSTEM_MESSAGE',
    submenus: [
      // 消息模板设置
      {
        label: i18n['settings.left_menu.message_setting.sub_menu.MAIL'],
        link: '/message/template/mail',
        right: 'SYSTEM_MESSAGE_EP'
      },
      {
        label: i18n['settings.left_menu.message_setting.sub_menu.WEB_ALERT'],
        link: '/message/template/popup',
        right: 'SYSTEM_MESSAGE_TP'
      },
      {
        label: i18n['settings.left_menu.message_setting.sub_menu.WEB'],
        link: '/message/template/system',
        right: 'SYSTEM_MESSAGE_SN'
      },
      {
        label: i18n['settings.left_menu.message_setting.sub_menu.SMS'],
        link: '/message/template/message',
        right: 'SYSTEM_MESSAGE_SP'
      }
    ]
  },
  {
    // 操作日志
    label: i18n['settings.left_menu.log'],
    icon: 'logs',
    category: 'log',
    right: 'SYSTEM_LOG',
    submenus: [
      // 基础模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.basic_log'],
        link: '/log/basic',
        right: 'SYSTEM_LOG_BASIC'
      },
      // 用户模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.user_log'],
        link: '/log/user',
        right: 'SYSTEM_LOG_USER'
      },
      // TA用户模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.tw_user_log'],
        link: '/log/twuser',
        right: 'SYSTEM_LOG_TWUSER'
      },
      // 消息模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.message_log'],
        link: '/log/message',
        right: 'SYSTEM_LOG_MESSAGE'
      },
      // 客户模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.customer_log'],
        link: '/log/customer',
        right: 'SYSTEM_LOG_CUSTOMER'
      },
      // 账户模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.account_log'],
        link: '/log/account',
        right: 'SYSTEM_LOG_ACCOUNT'
      },
      // 系统模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.system_log'],
        link: '/log/system',
        right: 'SYSTEM_LOG_SYSTEM'
      },
      // 任务模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.task_log'],
        link: '/log/task',
        right: 'SYSTEM_LOG_TASK'
      },
      // 报表模块操作日志
      {
        label: i18n['settings.left_menu.log.sub_menu.report_log'],
        link: '/log/report',
        right: 'SYSTEM_LOG_REPORT'
      }
    ]
  },
  {
    // 用户管理
    label: i18n['settings.left_menu.user_setting'],
    icon: 'user-soild',
    category: 'user',
    right: 'SYSTEM_USER',
    submenus: [
      // 角色权限设置
      {
        label: i18n['settings.left_menu.user_setting.sub_menu.role_setting'],
        link: '/user/roleSetting',
        right: 'SYSTEM_USER_ROLEAUTH'
      }
    ]
  },
  // 推广链接设置
  {
    label: i18n['settings.left_menu.user_setting.sub_menu.link_setting'],
    icon: 'outingold-soild',
    category: 'link',
    link: '/linkSetting',
    right: 'SYSTEM_USER_LINK'
  },
  {
    // 账户管理
    label: i18n['settings.left_menu.account_setting'],
    icon: 'creditcard',
    category: 'account',
    right: 'SYSTEM_ACCOUNT',
    submenus: [
      // 账户组设置
      {
        label:
          i18n[
            'settings.left_menu.account_setting.sub_menu.account_group_setting'
          ],
        link: '/account/accountsetting',
        right: 'SYSTEM_ACCOUNT_GROUP'
      },
      {
        label:
          i18n[
            'settings.left_menu.account_setting.sub_menu.account_group_manager'
          ],
        link: '/account/accountgroup',
        right: 'BW_ACCOUNT_GROUP'
      }
    ]
  },
  {
    // 返佣管理
    label: i18n['settings.left_menu.rebate_setting'],
    icon: 'dollar-soild',
    category: 'rebate',
    right: 'SYSTEM_REBATE',
    submenus: [
      // 返佣层级设置
      {
        label:
          i18n[
            'settings.left_menu.rebate_setting.sub_menu.user_hierarchy_setting'
          ],
        link: '/rebate/levelSetting'
      },
      // 品种组设置
      {
        label:
          i18n[
            'settings.left_menu.rebate_setting.sub_menu.symbol_group_setting'
          ],
        link: '/rebate/symbolGroupSetting'
      },
      // 层级设置
      {
        label: i18n['settings.left_menu.rebate_setting.level_setting'],
        category: 'level',
        mode: 'MULTI_AGENT',
        submenus: [
          {
            label:
              i18n[
                'settings.left_menu.rebate_setting.sub_menu.transaction_rule_setting'
              ],
            link: '/rebate/transactionRuleSetting'
          },
          {
            label:
              i18n[
                'settings.left_menu.rebate_setting.sub_menu.deposit_rule_setting'
              ],
            link: '/rebate/depositRuleSetting'
          },
          {
            label:
              i18n[
                'settings.left_menu.rebate_setting.sub_menu.profit_rule_setting'
              ],
            link: '/rebate/profitRuleSetting'
          },
          {
            label:
              i18n[
                'settings.left_menu.rebate_setting.sub_menu.fee_returns_rule_setting'
              ],
            link: '/rebate/feeReturnsRuleSetting'
          }
        ]
      },
      // 分销代理模式设置
      {
        label:
          i18n[
            'settings.left_menu.rebate_setting.sub_menu.distribution_setting'
          ],
        link: '/rebate/distribution',
        mode: 'DISTRIBUTION'
      }
      // 交易返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.transaction_rule_setting'], link: 'rebate/transactionRuleSetting'},
      // 入金返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.deposit_rule_setting'], link: 'rebate/depositRuleSetting'},
      // 盈利分成返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.profit_rule_setting'], link: 'rebate/profitRuleSetting'}
      // 分销返佣设置
      // {label: i18n['settings.left_menu.rebate_setting.sub_menu.distribution_rule_setting'], link: 'rebate/distribution/distributionRuleSetting'}
    ]
  },
  {
    // 出入金统计设置
    label: i18n['settings.left_menu.deposit_withdraw'],
    icon: 'outingold-soild',
    category: 'depositWithdraw',
    right: 'SYSTEM_DW',
    link: '/depositWithdraw'
  },
  {
    // 交易模式设置
    label: i18n['settings.left_menu.trade_setting'],
    icon: 'dollar',
    category: 'trade',
    right: 'SYSTEM_TRADEMODE',
    submenus: [
      // 筛选条件设置
      {
        label: i18n['settings.left_menu.account_trade_setting'],
        link: '/trade/account',
        right: 'SYSTEM_CONDITION_ACCOUNT'
      }
    ]
  },
  {
    // 定时报告
    label: i18n['settings.notify_center'],
    icon: 'message-soild',
    category: 'NotifyCenter',
    right: 'SYSTEM_NOTICE',
    link: '/NotifyCenter'
  },
  {
    label: i18n['settings.custom_report'],
    icon: 'custom-report',
    category: 'customReport',
    right: 'SYSTEM_REOPORT',
    submenus: [
      {
        label: i18n['settings.custom_report_mgmt'],
        link: '/customReport'
      }
    ]
  },
  {
    label: i18n['settings.black_list'],
    icon: 'custom-report',
    category: 'blackList',
    right: 'SYSTEM_BLACKLIST',
    link: '/blackList'
  }
];

export const GET_MENUS_FOR_HEADER = ({ userRights }) =>
  MENUS.reduce((menus, menu) => {
    const { label, right, submenus } = menu;
    let link;
    if (!(userRights[right] || right === undefined)) {
      return menus;
    } else if (submenus) {
      const firstRightSubMenu = menu.submenus.find(
        submenu => userRights[submenu.right] || submenu.right === undefined
      );
      if (!firstRightSubMenu) return menus;
      link = `/settings${firstRightSubMenu.link}`;
    } else {
      link = `/settings${menu.link}`;
    }

    return menus.concat({
      label,
      link,
      right
    });
  }, []);
