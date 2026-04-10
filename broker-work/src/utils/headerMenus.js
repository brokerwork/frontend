import i18n from 'utils/i18n';
import { GET_MENUS_FOR_HEADER } from 'utils/settingMenu';
export const MENUS = [
  {
    // 仪表盘
    label: `${i18n['navigation.dashboard']}`,
    link: '/dashboard',
    id: 'dashboard',
    right: 'DASHBOARD'
    // submenu: [
    //   // {label: i18n['navigation.dashboard.my_dashboard'], link: '/dashboard'},
    //   {
    //     label: i18n['navigation.dashboard.achievements'],
    //     link: '/dashboard/achievements',
    //     right: 'DASHBOARD_TYPE_PFS'
    //   },
    //   {
    //     label: i18n['navigation.dashboard.customer_source'],
    //     link: '/dashboard/customer-source',
    //     right: 'DASHBOARD_TYPE_SOURCE'
    //   },
    //   {
    //     label: i18n['navigation.dashboard.customer_data'],
    //     link: '/dashboard/customer-data',
    //     right: 'DASHBOARD_TYPE_CDA'
    //   }
    // ]
  },
  {
    // 用户管理标题g
    label: `${i18n['navigation.user.module_name']}`,
    link: '',
    id: 'usermgmt',
    right: 'USER',
    submenu: [
      {
        label: i18n['navigation.user.user_managment'],
        link: '/usermgmt',
        right: 'BW_USER'
      },
      {
        label: i18n['navigation.ta_user_management'],
        link: '/bwtauser',
        right: 'TAUSER_ENABLE'
      }
    ]
  },
  {
    // 客户管理标题
    label: `${i18n['navigation.customer.module_name']}`,
    link: '',
    id: 'custommgmt',
    right: 'CUSTOMER',
    submenu: [
      {
        label: i18n['navigation.customer.module_name'],
        link: '/custommgmt/customers'
      },
      // {
      //   label: i18n['navigation.customer.contacts_mgmt'],
      //   link: '/custommgmt/contactsroot',
      //   right: 'CUSTOMER_CONTACTS'
      // },
      {
        label: i18n['navigation.customer.sales_opportunity'],
        link: '/custommgmt/salesopportunities',
        right: 'CUSTOMER_SALEOPP'
      }
    ]
  },
  {
    // 账户管理标题
    label: `${i18n['navigation.account.module_name']}`,
    link: '/accountmgmt',
    id: 'accountmgmt',
    right: 'ACCOUNT'
  },
  {
    // 任务管理标题
    label: `${i18n['navigation.task.module_name']}`,
    // link: '/taskmgmt',
    id: 'taskmgmt',
    right: 'TASK'
  },
  {
    // 佣金报表-栏目标题
    label: `${i18n['navigation.report.module_name']}`,
    link: '',
    right: 'STAT',
    id: 'reportmgmt',
    submenu: [
      {
        label: `${i18n['navigation.report.accountreport_managment']}`,
        link: '',
        right: 'STAT_VIEW_ACC',
        id: 'reports',
        submenu: [
          {
            label: i18n['report.account_table_type.AccountSummary'],
            link: '/reportmgmt/reports/AccountSummary',
            right: 'STAT_VIEW_ACC_REPORTTYPE_ZACC'
          },
          {
            label: i18n['report.account_table_type.AccountDw'],
            link: '/reportmgmt/reports/AccountDw',
            right: 'STAT_VIEW_ACC_REPORTTYPE_FUND'
          },
          {
            label: i18n['report.account_table_type.position'],
            link: '/reportmgmt/reports/Position',
            right: 'STAT_VIEW_ACC_REPORTTYPE_POSITION'
          },
          {
            label: i18n['report.account_table_type.order'],
            link: '/reportmgmt/reports/Order',
            right: 'STAT_VIEW_ACC_REPORTTYPE_GUADAN'
          },
          {
            label: i18n['report.account_table_type.HistoryOrder'],
            link: '/reportmgmt/reports/HistoryOrder',
            right: 'STAT_VIEW_ACC_REPORTTYPE_HISTORY'
          },
          {
            label: i18n['report.account_table_type.SymbolGroup'],
            link: '/reportmgmt/reports/SymbolGroup',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_VCR'
          },
          {
            label: i18n['report.account_table_type.StopLoss'],
            link: '/reportmgmt/reports/StopLimit',
            right: 'STAT_VIEW_ACC_REPORTTYPE_SLCS'
          },
          {
            label: i18n['report.account_table_type.NewUser'],
            link: '/reportmgmt/reports/NewUser',
            right: 'STAT_VIEW_ACC_REPORTTYPE_NAR'
          }
        ]
      },
      {
        label: `${i18n['navigation.report.commissionreport_managment']}`,
        link: '',
        right: 'STAT_VIEW_COMMISSION',
        id: 'commissionreports',
        submenu: [
          {
            label: i18n['report.commission_table_type.LotsNew'],
            link: '/reportmgmt/commissionreports/LotsNew',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_TRADE'
          },
          {
            label: i18n['report.commission_table_type.LotsNewSearch'],
            link: '/reportmgmt/commissionreports/LotsNewSearch',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_TRADE'
          },
          {
            label: i18n['report.commission_table_type.Deposit'],
            link: '/reportmgmt/commissionreports/Deposit',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_DEPOSIT'
          },
          {
            label: i18n['report.commission_table_type.NetDeposit'],
            link: '/reportmgmt/commissionreports/NetDeposit',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_NETDEPOSIT'
          },
          {
            label: i18n['report.commission_table_type.Profit'],
            link: '/reportmgmt/commissionreports/Profit',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_PROFIT'
          },
          {
            label: i18n['report.commission_table_type.NetProfit'],
            link: '/reportmgmt/commissionreports/NetProfit',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_NETPROFIT'
          },
          {
            label: i18n['report.commission_table_type.CommissionCharge'],
            link: '/reportmgmt/commissionreports/CommissionCharge',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_COMMISSION'
          },
          {
            label: i18n['report.commission_table_type.RealTime'],
            link: '/reportmgmt/commissionreports/RealTime',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_AUTO'
          },
          {
            label: i18n['report.commission_table_type.RTCommission'],
            link: '/reportmgmt/commissionreports/RTCommission',
            right: 'STAT_VIEW_COMMISSION_REPORTTYPE_RCR'
          }
        ]
      },
      {
        label: `${i18n['navigation.report.outstandingreport_managment']}`,
        link: '/reportmgmt/outstandingreport',
        right: 'STAT_VIEW_ACHIEVEMENT'
      },
      {
        label: `${i18n['report.customer_signing_performance.report_header']}`,
        link: '/bkRportmgmt/customerSigningPerformanceReport',
        right: 'STAT_VIEW_CUSTOMER_CONTRACTCUS'
      },
      {
        label: `${i18n['report.payment.report_name']}`,
        link: '/bkRportmgmt/paymentreport',
        right: 'STAT_VIEW_CUSTOMER_CUSPAYMENT'
      }
    ],
    externalMenu: [
      {
        label: `${i18n['report.download_center.header']}`,
        link: '/reportmgmt/downloadcenter'
      },
      {
        label: `${i18n['settings.custom_report']}`,
        link: '/settings/customReport',
        right: 'SYSTEM_REOPORT'
      }
    ]
  },
  {
    // 运营
    label: `${i18n['navigation.runmgmt']}`,
    link: '/runmgmt',
    id: 'runmgmt',
    right: 'LIVE' // 权限还没加，暂时用这个权限
  },
  {
    // 消息
    label: `${i18n['navigation.message']}`,
    link: '/msgmgmt',
    id: 'msgmgmt',
    right: 'MESSAGE_VIEW'
  }
  // {
  //   // 设置
  //   label: `${i18n['navigation.setting.module_name']}`,
  //   link: '',
  //   id: 'settings',
  //   right: 'SYSTEM',
  //   renderSubmenu: GET_MENUS_FOR_HEADER
  // },
];
