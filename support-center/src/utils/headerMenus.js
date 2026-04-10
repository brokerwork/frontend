import i18n from 'utils/i18n';
export const MENUS = [
  {
    // 用户管理标题
    label: `${i18n['navigation.user.module_name']}`,
    link: '/usermgmt',
    id: 'usermgmt',
    right: 'USER'
  },
  {
    // 客户管理标题
    label: `${i18n['navigation.customer.module_name']}`,
    link: '',
    id: 'custommgmt',
    right: 'CUSTOMER',
    submenu: [
          {label: i18n['navigation.customer.module_name'], link: '/custommgmt'},
          {label: i18n['navigation.customer.contacts_mgmt'], link: '/custommgmt#/contactsroot', right: 'CUSTOMER_CONTACTS'},
          {label: i18n['navigation.customer.sales_opportunity'], link: '/custommgmt#/salesopportunities', right: 'CUSTOMER_SALEOPP'}
    ]
  },
  {
    // 任务管理标题
    label: `${i18n['navigation.task.module_name']}`,
    link: '/taskmgmt',
    id: 'taskmgmt',
    right: 'TASK'
  },
  {
    // 账户管理标题
    label: `${i18n['navigation.account.module_name']}`,
    link: '/accountmgmt',
    id: 'accountmgmt',
    right: 'ACCOUNT'
  },
  {
    // 佣金报表-栏目标题
    label: `${i18n['navigation.report.module_name']}`,
    link: '',
    right: 'STAT',
    id: 'reportmgmt',
    submenu: [
        {label: `${i18n['navigation.report.accountreport_managment']}`, link: '/reportmgmt#/reports', right: 'STAT_VIEW_ACC'},
        {label: `${i18n['navigation.report.commissionreport_managment']}`, link: '/reportmgmt#/commissionreports', right: 'STAT_VIEW_COMMISSION'},
    ],
    externalMenu: [
      {label: `${i18n['report.download_center.header']}`, link: '/reportmgmt#/downloadcenter'}
    ]
  },
  {
    // TA用户管理
    label: `${i18n['navigation.ta_user_management']}`,
    link: '/bwtauser',
    id: 'bwtauser',
    right: 'TAUSER'
  }
];