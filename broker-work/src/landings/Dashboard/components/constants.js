const dashboardItemTypes = {
  COMMISSION_PANEL: {
    value: 'COMMISSION_PANEL',
    label: 'dashboard.chart_title.COMMISSION_PANEL',
    chart: 'commission',
    url: '/dashboard/achievements/commission',
    right: 'commission',
    category: 'DASHBOARD_TYPE_PFS_COMMISSION'
  },
  NEW_CUSTOMER_PAGE: {
    value: 'NEW_CUSTOMER_PAGE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  NEW_CUSTOMER_HAS_DEPOSIT_PAGE: {
    value: 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEPOSIT_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  NEW_CUSTOMER_HAS_DEAL_PAGE: {
    value: 'NEW_CUSTOMER_HAS_DEAL_PAGE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEAL_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  NEW_ACCOUNT_PAGE: {
    value: 'NEW_ACCOUNT_PAGE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkAccount',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  NEW_ACCOUNT_HAS_DEPOSIT_PAGE: {
    value: 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEPOSIT_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkAccount',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  NEW_ACCOUNT_HAS_DEAL_PAGE: {
    value: 'NEW_ACCOUNT_HAS_DEAL_PAGE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEAL_PAGE',
    chart: 'newCustomer',
    url: '/dashboard/achievements/new-customers',
    right: 'checkAccount',
    category: 'DASHBOARD_TYPE_PFS_NC'
  },
  USER_RANK_NEW_CUSTOMER_PAGE: {
    value: 'USER_RANK_NEW_CUSTOMER_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_CUSTOMER_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_ACCOUNT_PAGE: {
    value: 'USER_RANK_NEW_ACCOUNT_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_ACCOUNT_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_DEPOSIT_PAGE: {
    value: 'USER_RANK_NEW_DEPOSIT_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_DEPOSIT_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_WITHDRAWAL_PAGE: {
    value: 'USER_RANK_NEW_WITHDRAWAL_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_WITHDRAWAL_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_DEAL_PAGE: {
    value: 'USER_RANK_NEW_DEAL_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_DEAL_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_PROFIT_PAGE: {
    value: 'USER_RANK_NEW_PROFIT_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_PROFIT_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_NET_DEPOSIT_PAGE: {
    value: 'USER_RANK_NEW_NET_DEPOSIT_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_NET_DEPOSIT_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_COMMISSION_PAGE: {
    value: 'USER_RANK_NEW_COMMISSION_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_COMMISSION_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'commission',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE: {
    value: 'USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE',
    label: 'dashboard.chart_title.USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE',
    chart: 'staffPerformance',
    function: 'getRankingsData',
    url: '/dashboard/achievements/staff-performance',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_RANK'
  },
  TOTAL_CUSTOMER_PAGE: {
    value: 'TOTAL_CUSTOMER_PAGE',
    label: 'dashboard.data_type.TOTAL_CUSTOMER_PAGE',
    chart: 'totalCustomer',
    url: '/dashboard/achievements/total-customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_CC'
  },
  TOTAL_ACCOUNT_PAGE: {
    value: 'TOTAL_ACCOUNT_PAGE',
    label: 'dashboard.data_type.TOTAL_ACCOUNT_PAGE',
    chart: 'totalCustomer',
    url: '/dashboard/achievements/total-customers',
    right: 'checkAccount',
    category: 'DASHBOARD_TYPE_PFS_CC'
  },
  CUSTOMER_RANK_DEPOSIT: {
    value: 'CUSTOMER_RANK_DEPOSIT',
    label: `dashboard.chart_title.CUSTOMER_RANK_DEPOSIT`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  CUSTOMER_RANK_WITHDRAWAL: {
    value: 'CUSTOMER_RANK_WITHDRAWAL',
    label: `dashboard.chart_title.CUSTOMER_RANK_WITHDRAWAL`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  CUSTOMER_RANK_NET_DEPOSIT: {
    value: 'CUSTOMER_RANK_NET_DEPOSIT',
    label: `dashboard.chart_title.CUSTOMER_RANK_NET_DEPOSIT`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  CUSTOMER_RANK_DEAL_VOLUME: {
    value: 'CUSTOMER_RANK_DEAL_VOLUME',
    label: `dashboard.chart_title.CUSTOMER_RANK_DEAL_VOLUME`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  CUSTOMER_RANK_PROFIT: {
    value: 'CUSTOMER_RANK_PROFIT',
    label: `dashboard.chart_title.CUSTOMER_RANK_PROFIT`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  CUSTOMER_RANK_LOSS: {
    value: 'CUSTOMER_RANK_LOSS',
    label: `dashboard.chart_title.CUSTOMER_RANK_LOSS`,
    function: 'getCustomerRankings',
    type: 'customer',
    chart: 'customerRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_DEPOSIT: {
    value: 'ACCOUNT_RANK_DEPOSIT',
    label: `dashboard.chart_title.ACCOUNT_RANK_DEPOSIT`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_WITHDRAWAL: {
    value: 'ACCOUNT_RANK_WITHDRAWAL',
    label: `dashboard.chart_title.ACCOUNT_RANK_WITHDRAWAL`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_NET_DEPOSIT: {
    value: 'ACCOUNT_RANK_NET_DEPOSIT',
    label: `dashboard.chart_title.ACCOUNT_RANK_NET_DEPOSIT`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_DEAL_VOLUME: {
    value: 'ACCOUNT_RANK_DEAL_VOLUME',
    label: `dashboard.chart_title.ACCOUNT_RANK_DEAL_VOLUME`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_PROFIT: {
    value: 'ACCOUNT_RANK_PROFIT',
    label: `dashboard.chart_title.ACCOUNT_RANK_PROFIT`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  ACCOUNT_RANK_LOSS: {
    value: 'ACCOUNT_RANK_LOSS',
    label: `dashboard.chart_title.ACCOUNT_RANK_LOSS`,
    function: 'getAccountRankings',
    type: 'account',
    chart: 'accountRank',
    url: '/dashboard/customer-data/customer-rankings',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_TAR'
  },
  DEPOSIT_MONEY_TREND: {
    value: 'DEPOSIT_MONEY_TREND',
    label: 'dashboard.chart_title.DEPOSIT_MONEY_TREND',
    key: ['NEW_DEPOSIT_PAGE', 'NEW_WITHDRAWAL_PAGE', 'NEW_NET_DEPOSIT_PAGE'],
    chart: 'trade',
    url: '/dashboard/achievements/trade',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_FUND'
  },
  NEW_DEAL_PAGE: {
    value: 'NEW_DEAL_PAGE',
    label: 'dashboard.chart_title.NEW_DEAL_PAGE',
    chart: 'trade',
    url: '/dashboard/achievements/trade',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_PFS_FUND'
  },
  DEPOSIT_CUSTOMER_TREND: {
    value: 'DEPOSIT_CUSTOMER_TREND',
    label: 'dashboard.chart_title.DEPOSIT_CUSTOMER_TREND',
    key: ['NEW_DEPOSIT_CUSTOMER_PAGE'],
    chart: 'depositTrend',
    url: '/dashboard/achievements/trade',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_FUND'
  },
  WITHDRAWAL_TREND: {
    value: 'WITHDRAWAL_TREND',
    label: 'dashboard.chart_title.WITHDRAWAL_TREND',
    key: ['NEW_WITHDRAWAL_CUSTOMER_PAGE'],
    chart: 'withdrawalTrend',
    url: '/dashboard/achievements/trade',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_FUND'
  },
  DEPOSIT_DISTRIBUTE_TREND: {
    value: 'DEPOSIT_DISTRIBUTE_TREND',
    label: 'dashboard.chart_title.DEPOSIT_DISTRIBUTE_TREND',
    function: 'getDepositDistribute',
    chart: 'depositDistribute',
    url: '/dashboard/achievements/trade',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_PFS_FUND'
  },
  NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE: {
    value: 'NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE',
    label: 'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE',
    key: ['NEW_CUSTOMER_ACTIVE_PANEL'],
    chart: 'activeCustomer',
    url: '/dashboard/customer-data/active-customer',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_AC'
  },
  NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE: {
    value: 'NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE',
    label: 'dashboard.data_type.NEW_CUSTOMER_TENANT_ACTIVE_DEAL_PAGE',
    chart: 'activeCustomer',
    url: '/dashboard/customer-data/active-customer',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_AC'
  },
  NEW_CUSTOMER_TENANT_DORMANT_PAGE: {
    value: 'NEW_CUSTOMER_TENANT_DORMANT_PAGE',
    label: 'dashboard.data_type.NEW_CUSTOMER_TENANT_DORMANT_PAGE',
    chart: 'customerDormant',
    url: '/dashboard/customer-data/customer-dormant',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_DC'
  },
  ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE: {
    value: 'ACTIVATE_CUSTOMER_REGISTER_NO_ACCOUNT_PAGE',
    label: 'dashboard.table_header.registed_no_account',
    chart: 'customers',
    url: '/dashboard/customer-data/customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_CP'
  },
  ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE: {
    value: 'ACTIVATE_CUSTOMER_HAS_ACCOUNT_NO_DEPOSIT_PAGE',
    label: 'dashboard.table_header.have_account_no_deposit',
    chart: 'customers',
    url: '/dashboard/customer-data/customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_CP'
  },
  ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE: {
    value: 'ACTIVATE_CUSTOMER_HAS_DEPOSIT_NO_DEAL_PAGE',
    label: 'dashboard.table_header.deposited_not_deal',
    chart: 'customers',
    url: '/dashboard/customer-data/customers',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_CDA_CP'
  },
  TRADE_VARIRTY_DISTRIBUTE: {
    value: 'TRADE_VARIRTY_DISTRIBUTE',
    label: 'dashboard.chart_title.TRADE_VARIRTY_DISTRIBUTE',
    function: 'getTradeVarietyDistribute',
    chart: 'tradeVarietyDistribute',
    url: '/dashboard/customer-data/trade-variety-distribute',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_CDA_DT'
  },
  SOURCE_TUNNEL: {
    value: 'SOURCE_TUNNEL',
    label: 'dashboard.chart_title.SOURCE_TUNNEL',
    function: 'getTransferFunnel',
    chart: 'transferFunnel',
    url: '/dashboard/customer-source/transfom-funnel',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_FUNEL'
  },
  NEW_CUSTOMER_PAGE_TREND: {
    value: 'NEW_CUSTOMER_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_CUSTOMER_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_CUSTOMER_PAGE'],
    activeData: 'NEW_CUSTOMER_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_CUSTOMER_HAS_DEPOSIT_PAGE_TREND: {
    value: 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEPOSIT_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_CUSTOMER_HAS_DEPOSIT_PAGE'],
    activeData: 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_CUSTOMER_HAS_DEAL_PAGE_TREND: {
    value: 'NEW_CUSTOMER_HAS_DEAL_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEAL_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_CUSTOMER_HAS_DEAL_PAGE'],
    activeData: 'NEW_CUSTOMER_HAS_DEAL_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_PAGE_TREND: {
    value: 'NEW_ACCOUNT_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_ACCOUNT_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_ACCOUNT_PAGE'],
    activeData: 'NEW_ACCOUNT_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_HAS_DEPOSIT_PAGE_TREND: {
    value: 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEPOSIT_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_ACCOUNT_HAS_DEPOSIT_PAGE'],
    activeData: 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_HAS_DEAL_PAGE_TREND: {
    value: 'NEW_ACCOUNT_HAS_DEAL_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEAL_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_ACCOUNT_HAS_DEAL_PAGE'],
    activeData: 'NEW_ACCOUNT_HAS_DEAL_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_DEPOSIT_PAGE_TREND: {
    value: 'NEW_DEPOSIT_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_DEPOSIT_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_DEPOSIT_PAGE'],
    activeData: 'NEW_DEPOSIT_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_DEAL_PAGE_TREND: {
    value: 'NEW_DEAL_PAGE_TREND',
    label: 'dashboard.chart_title.NEW_DEAL_PAGE_TREND',
    key: ['SOURCE_TREND_NEW_DEAL_PAGE'],
    activeData: 'NEW_DEAL_PAGE',
    type: 'line',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_CUSTOMER_PAGE_DISTRIBUTE: {
    value: 'NEW_CUSTOMER_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_CUSTOMER_PAGE'],
    activeData: 'NEW_CUSTOMER_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_CUSTOMER_HAS_DEPOSIT_PAGE_DISTRIBUTE: {
    value: 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEPOSIT_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_CUSTOMER_HAS_DEPOSIT_PAGE'],
    activeData: 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_CUSTOMER_HAS_DEAL_PAGE_DISTRIBUTE: {
    value: 'NEW_CUSTOMER_HAS_DEAL_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_CUSTOMER_HAS_DEAL_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_CUSTOMER_HAS_DEAL_PAGE'],
    activeData: 'NEW_CUSTOMER_HAS_DEAL_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'checkCustomer',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_PAGE_DISTRIBUTE: {
    value: 'NEW_ACCOUNT_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_ACCOUNT_PAGE'],
    activeData: 'NEW_ACCOUNT_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_HAS_DEPOSIT_PAGE_DISTRIBUTE: {
    value: 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEPOSIT_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_ACCOUNT_HAS_DEPOSIT_PAGE'],
    activeData: 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_ACCOUNT_HAS_DEAL_PAGE_DISTRIBUTE: {
    value: 'NEW_ACCOUNT_HAS_DEAL_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_ACCOUNT_HAS_DEAL_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_ACCOUNT_HAS_DEAL_PAGE'],
    activeData: 'NEW_ACCOUNT_HAS_DEAL_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_DEPOSIT_PAGE_DISTRIBUTE: {
    value: 'NEW_DEPOSIT_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_DEPOSIT_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_DEPOSIT_PAGE'],
    activeData: 'NEW_DEPOSIT_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  },
  NEW_DEAL_PAGE_DISTRIBUTE: {
    value: 'NEW_DEAL_PAGE_DISTRIBUTE',
    label: 'dashboard.chart_title.NEW_DEAL_PAGE_DISTRIBUTE',
    key: ['SOURCE_DISTRIBUTE_NEW_DEAL_PAGE'],
    activeData: 'NEW_DEAL_PAGE',
    type: 'pie',
    chart: 'transformTrend',
    url: '/dashboard/customer-source/transfom-trends',
    right: 'accountTrade',
    category: 'DASHBOARD_TYPE_SOURCE_CON'
  }
};

export default dashboardItemTypes;
