import i18n from 'utils/i18n';

export const MENU = [
  {
    icon: 'compass',
    label: i18n['left.menu.dashboard'],
    link: '/home/dashboard',
    category: 'SC',
    module: 'home',
    default: true
  },
  {
    icon: 'credit-card',
    label: i18n['left.menu.consumption'],
    link: '/home/consumption',
    category: 'SC',
    eventKey: 'consumption'
    // default: true
  },
  {
    icon: 'hdd-o',
    label: 'Broker Work',
    category: 'BW',
    eventKey: 'broker',
    subMenu: [
      {
        label: i18n['left.menu.product.detail'],
        link: '/home/broker/productDetail',
        key: 'BW.PRODUCT.DETAIL',
        module: 'home'
        // iframeUrl: "/static/view/broker/detail/view.html"
      },
      {
        label: i18n['left.menu.brand.setting'],
        link: '/home/broker/brandSetting',
        key: 'BW.BRAND.SETTING',
        module: 'home',
        iframeUrl: '/static/view/broker/brand/view.html'
      },
      {
        label: i18n['left.menu.access.setting'],
        link: '/home/broker/accessSetting',
        key: 'BW.ACCESS.SETTING',
        module: 'home',
        iframeUrl: '/static/view/broker/access/view.html'
      },
      {
        label: i18n['left.menu.email.setting'],
        link: '/home/broker/emailSetting',
        key: 'BW.EMAIL.SETTING',
        module: 'home',
        iframeUrl: '/static/view/broker/email/view.html'
      },
      {
        label: i18n['left.menu.connector.setting'],
        link: '/home/broker/connectorSetting',
        key: 'BW.MT.SETTING',
        module: 'home',
        iframeUrl: '/static/view/broker/connector/view.html'
      },
      {
        label: i18n['left.menu.field.setting'],
        link: '/home/broker/fieldSetting',
        key: 'BW.FIELD.SETTING',
        module: 'home',
        iframeUrl: '/static/view/broker/fields/view.html'
      }
    ]
  },
  {
    icon: 'bar-chart',
    label: 'Feed Work',
    category: 'FW',
    eventKey: 'feed',
    subMenu: [
      {
        label: i18n['left.menu.product.detail'],
        link: '/home/feed/productDetail',
        key: 'FW.PRODUCT.DETAIL',
        module: 'home',
        iframeUrl: '/static/view/feeder/detail/view.html'
      },
      {
        label: i18n['left.menu.symbol.manager'],
        link: '/home/feed/symbolManagement',
        key: 'FW.FOREX.MGR',
        module: 'home',
        iframeUrl: '/static/view/feeder/mgmt/view.html'
      },
      {
        label: i18n['left.menu.tick'],
        link: '/home/feed/realTimeQuote',
        key: 'FW.FOREX.TSS',
        module: 'home',
        iframeUrl: '/static/view/feeder/tick/view.html'
      },
      {
        label: i18n['left.menu.hdstick'],
        link: '/home/feed/historicalTick',
        key: 'FW.FOREX.HDST',
        module: 'home',
        iframeUrl: '/static/view/feeder/hdstick/view.html'
      },
      {
        label: i18n['left.menu.hdsbar'],
        link: '/home/feed/historicalQuote',
        key: 'FW.FOREX.HDSB',
        module: 'home',
        iframeUrl: '/static/view/feeder/hdsbar/view.html'
      },
      {
        label: i18n['product.detail.type.TradeSignal'],
        link: '/home/feed/tradeSignal',
        key: 'FW.FOREX.TS',
        module: 'home',
        iframeUrl: '/static/view/feeder/signal/view.html'
      },
      {
        label: i18n['left.menu.future.symbol.manager'],
        link: '/home/feed/futureSymbol',
        key: 'FW.FUTURE.MGR',
        module: 'home',
        iframeUrl: '/static/view/feeder/futuresymbol/view.html'
      },
      {
        label: i18n['left.menu.future.realtime'],
        link: '/home/feed/futureRealTimeTick',
        key: 'FW.FUTURE.TSS',
        module: 'home',
        iframeUrl: '/static/view/feeder/futurerealtime/view.html'
      }
    ]
  },
  {
    icon: 'database',
    label: 'Trader Work',
    category: 'TW',
    eventKey: 'trader',
    subMenu: [
      {
        label: i18n['left.menu.product.detail'],
        link: '/home/trader/productDetail',
        key: 'TW.PRODUCT.DETAIL',
        module: 'home',
        iframeUrl: '/static/view/trader/detail/view.html'
      },
      {
        label: i18n['left.menu.brand.setting'],
        link: '/home/trader/brandSetting',
        key: 'TW.BRAND.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/site/view.html'
      },
      {
        label: i18n['left.menu.access.setting'],
        link: '/home/trader/accessSetting',
        key: 'TW.ACCESS.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/access/view.html'
      },
      {
        label: i18n['left.menu.email.setting'],
        link: '/home/trader/emailSetting',
        key: 'TW.EMAIL.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/email/view.html'
      },
      {
        label: i18n['left.menu.account.manage'],
        link: '/home/trader/accountManage',
        key: 'TW.ACCOUNT.MANAGE',
        module: 'home',
        default: true,
        versionRight: 'SC_CUSTOM_ACCOUNT_TYPE'
      },
      {
        label: i18n['trader.account.profile.setting.header'],
        link: '/home/trader/accountSetting',
        key: 'TW.ACCOUNT.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/account/view.html',
        default: true
      },
      {
        label: i18n['left.menu.form.setting'],
        link: '/home/trader/formSetting',
        key: 'TW.ROA.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/form/view.html'
      },
      {
        label: i18n['left.menu.platmt4.setting'],
        link: '/home/trader/mt4Setting',
        key: 'TW.MT4.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/platmt4/view.html'
      },
      {
        label: i18n['left.menu.platmt5.setting'],
        link: '/home/trader/mt5Setting',
        key: 'TW.MT5.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/platmt5/view.html'
      },
      {
        label: i18n['left.menu.platmtCtrader.setting'],
        link: '/home/trader/ctraderSetting',
        key: 'TW.CTRADER.SETTING',
        module: 'home',
        iframeUrl: '/static/view/trader/platctrader/view.html'
      },
      {
        label: i18n['left.menu.customPlatform.setting'],
        link: '/home/trader/customPlatform',
        default: true,
        versionRight: 'SC_CUSTOM_PLATFORM',
        module: 'home'
        // iframeUrl: '/static/view/trader/platctrader/view.html'
      },
      {
        label: i18n['left.menu.download.center'],
        link: '/home/trader/downloadCenter',
        key: 'TW.DOWNLOAD.CENTER',
        module: 'home',
        iframeUrl: '/static/view/trader/download/view.html'
      }
    ]
  },
  {
    icon: 'sliders',
    label: 'Bridge Work',
    category: 'GW',
    eventKey: 'bridge',
    subMenu: [
      {
        label: i18n['left.menu.product.detail'],
        link: '/home/bridge/productDetail',
        key: 'GW.PRODUCT.DETAIL_1.0',
        module: 'home',
        iframeUrl: '/static/view/openapi/detail/view.html'
      },
      {
        label: i18n['left.menu.connector.setting'],
        link: '/home/bridge/connectorSetting',
        key: 'GW.MT.SETTING_1.0',
        module: 'home',
        iframeUrl: '/static/view/openapi/server_old/view.html'
      },
      {
        label: i18n['left.menu.symbol.manager'],
        link: '/home/bridge/symbolManagement',
        key: 'GW.SYMBOL.MGR_1.0',
        module: 'home',
        iframeUrl: '/static/view/openapi/mgmt/view.html'
      },
      {
        label: i18n['left.menu.tick'],
        link: '/home/bridge/realTimeQuote',
        key: 'GW.TSS_1.0',
        module: 'home',
        iframeUrl: '/static/view/openapi/tick/view.html'
      },
      {
        label: i18n['left.menu.product.detail'],
        link: '/bridge/v2.0/productDetail',
        module: 'bridge',
        key: 'GW.PRODUCT.DETAIL_2.0'
      },
      {
        label: i18n['left.menu.product.detail'],
        link: '/bridge/v2.1/productDetail',
        module: 'bridge',
        key: 'GW.PRODUCT.DETAIL_2.1'
      },
      {
        label: i18n['left.menu.connector.setting'],
        link: '/bridge/v2.1/connectorSetting',
        module: 'bridge',
        key: 'GW.MT.SETTING_2.1'
      }
    ]
  },
  {
    icon: 'mobile',
    label: 'TRADER WORK MOBILE',
    category: 'TM',
    eventKey: 'twapp',
    subMenu: [
      {
        label: i18n['menu.twapp.product_detail'],
        link: '/home/twapp/productDetail',
        module: 'home',
        key: 'TM.PRODUCT.DETAIL'
      },
      {
        label: i18n['menu.twapp.brand_setting'],
        link: '/home/twapp/brandSetting',
        module: 'home',
        key: 'TM.BRAND.SETTING'
      },
      {
        label: i18n['menu.twapp.trade_server'],
        link: '/home/twapp/vendorSetting',
        module: 'home',
        key: 'TM.VENDOR.SETTING'
      },
      {
        label: i18n['menu.twapp.variety_setting'],
        link: '/home/twapp/varietySetting',
        module: 'home',
        key: 'TM.SYMBOL.SETTING'
      },
      {
        label: i18n['menu.twapp.trade_time_setting'],
        link: '/home/twapp/tradeTimeSetting',
        module: 'home',
        key: 'TM.TRADETIME.SETTING'
      },
      {
        label: i18n['menu.twapp.day_off_setting'],
        link: '/home/twapp/dayOffSetting',
        module: 'home',
        key: 'TM.HOLIDAY.SETTING'
      },
      {
        label: i18n['menu.twapp.custome_service_contact_setting'],
        link: '/home/twapp/customeServiceContactSetting',
        module: 'home',
        key: 'TM.CONTACTS.SETTING'
      },
      {
        label: i18n['menu.twapp.quotation_interval_setting'],
        link: '/home/twapp/quotationInterval',
        module: 'home',
        key: 'TM.QUOTEPERIOD.SETTING'
      },
      {
        label: i18n['menu.twapp.monthly_flow_report'],
        link: '/home/twapp/monthlyFlowReport',
        module: 'home',
        key: 'TM.FOLLOWORDER.SETTING'
      },
      {
        label: i18n['menu.twapp.follow_order_setting'],
        eventKey: 'twapp-followOrder',
        default: true,
        subMenu: [
          {
            label: i18n['menu.twapp.symbol_setting'],
            link: '/home/twapp/followOrder/symbolSetting',
            module: 'home',
            default: true
          },
          {
            label: i18n['menu.twapp.server_setting'],
            link: '/home/twapp/followOrder/connectorSetting',
            module: 'home',
            default: true
          }
        ]
      }
    ]
  },
  {
    icon: 'dealer',
    iconType: 'icomoon',
    label: 'Dealer Work',
    category: 'DW',
    eventKey: 'dealer',
    subMenu: [
      {
        label: i18n['menu.dealer.operate_report'],
        link: '/home/dealer/operateReport',
        module: 'home',
        key: 'DW.TENANT.DETAIL'
      },
      {
        label: i18n['menu.dealer.month_report'],
        link: '/home/dealer/monthReport',
        module: 'home',
        key: 'DW.MONTH.REPORT'
      }
    ]
  }
];
