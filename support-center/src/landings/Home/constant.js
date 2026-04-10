import i18n from 'utils/i18n';

export const MENU = [
  {
    icon: 'compass',
    label: i18n['left.menu.dashboard'],
    link: '/home/dashboard',
    category: 'dashboard',
    eventKey: 'dashboard',
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
        iframeUrl: '/static/view/broker/detail/view.html'
      },
      {
        label: i18n['left.menu.brand.setting'],
        link: '/home/broker/brandSetting',
        key: 'BW.BRAND.SETTING',
        iframeUrl: '/static/view/broker/brand/view.html'
      },
      {
        label: i18n['left.menu.access.setting'],
        link: '/home/broker/accessSetting',
        key: 'BW.ACCESS.SETTING',
        iframeUrl: '/static/view/broker/access/view.html'
      },
      {
        label: i18n['left.menu.email.setting'],
        link: '/home/broker/emailSetting',
        key: 'BW.EMAIL.SETTING',
        iframeUrl: '/static/view/broker/email/view.html'
      },
      {
        label: i18n['left.menu.connector.setting'],
        link: '/home/broker/connectorSetting',
        key: 'BW.MT.SETTING',
        iframeUrl: '/static/view/broker/connector/view.html'
      },
      {
        label: i18n['left.menu.field.setting'],
        link: '/home/broker/fieldSetting',
        key: 'BW.FIELD.SETTING',
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
        iframeUrl: '/static/view/feeder/detail/view.html'
      },
      {
        label: i18n['left.menu.symbol.manager'],
        link: '/home/feed/symbolManagement',
        key: 'FW.FOREX.MGR',
        iframeUrl: '/static/view/feeder/mgmt/view.html'
      },
      {
        label: i18n['left.menu.tick'],
        link: '/home/feed/realTimeQuote',
        key: 'FW.FOREX.TSS',
        iframeUrl: '/static/view/feeder/tick/view.html'
      },
      {
        label: i18n['left.menu.hdstick'],
        link: '/home/feed/historicalTick',
        key: 'FW.FOREX.HDST',
        iframeUrl: '/static/view/feeder/hdstick/view.html'
      },
      {
        label: i18n['left.menu.hdsbar'],
        link: '/home/feed/historicalQuote',
        key: 'FW.FOREX.HDSB',
        iframeUrl: '/static/view/feeder/hdsbar/view.html'
      },
      {
        label: i18n['product.detail.type.TradeSignal'],
        link: '/home/feed/tradeSignal',
        key: 'FW.FOREX.TS',
        iframeUrl: '/static/view/feeder/signal/view.html'
      },
      {
        label: i18n['left.menu.future.symbol.manager'],
        link: '/home/feed/futureSymbol',
        key: 'FW.FUTURE.MGR',
        iframeUrl: '/static/view/feeder/futuresymbol/view.html'
      },
      {
        label: i18n['left.menu.future.realtime'],
        link: '/home/feed/futureRealTimeTick',
        key: 'FW.FUTURE.TSS',
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
        iframeUrl: '/static/view/trader/detail/view.html'
      },
      {
        label: i18n['left.menu.brand.setting'],
        link: '/home/trader/brandSetting',
        key: 'TW.BRAND.SETTING',
        iframeUrl: '/static/view/trader/site/view.html'
      },
      {
        label: i18n['left.menu.access.setting'],
        link: '/home/trader/accessSetting',
        key: 'TW.ACCESS.SETTING',
        iframeUrl: '/static/view/trader/access/view.html'
      },
      {
        label: i18n['left.menu.email.setting'],
        link: '/home/trader/emailSetting',
        key: 'TW.EMAIL.SETTING',
        iframeUrl: '/static/view/trader/email/view.html'
      },
      {
        label: i18n['left.menu.platmt4.setting'],
        link: '/home/trader/mt4Setting',
        key: 'TW.MT4.SETTING',
        iframeUrl: '/static/view/trader/platmt4/view.html'
      },
      {
        label: i18n['left.menu.platmt5.setting'],
        link: '/home/trader/mt5Setting',
        key: 'TW.MT5.SETTING',
        iframeUrl: '/static/view/trader/platmt5/view.html'
      },
      {
        label: i18n['left.menu.platmtCtrader.setting'],
        link: '/home/trader/ctraderSetting',
        key: 'TW.CTRADER.SETTING',
        iframeUrl: '/static/view/trader/platctrader/view.html'
      },
      {
        label: i18n['left.menu.download.center'],
        link: '/home/trader/downloadCenter',
        key: 'TW.DOWNLOAD.CENTER',
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
        key: 'GW.PRODUCT.DETAIL',
        iframeUrl: '/static/view/openapi/detail/view.html'
      },
      {
        label: i18n['left.menu.connector.setting'],
        link: '/home/bridge/serverSetting',
        key: 'GW.MT.SETTING',
        iframeUrl: '/static/view/openapi/server/view.html'
      },
      {
        label: i18n['left.menu.symbol.manager'],
        link: '/home/bridge/symbolManagement',
        key: 'GW.SYMBOL.MGR',
        iframeUrl: '/static/view/openapi/mgmt/view.html'
      },
      {
        label: i18n['left.menu.tick'],
        link: '/home/bridge/realTimeQuote',
        key: 'GW.TSS',
        iframeUrl: '/static/view/openapi/tick/view.html'
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
        key: 'TM.PRODUCT.DETAIL'
      },
      {
        label: i18n['menu.twapp.brand_setting'],
        link: '/home/twapp/brandSetting',
        key: 'TM.BRAND.SETTING'
      },
      {
        label: i18n['menu.twapp.trade_server'],
        link: '/home/twapp/vendorSetting',
        key: 'TM.VENDOR.SETTING'
      },
      {
        label: i18n['menu.twapp.variety_setting'],
        link: '/home/twapp/varietySetting',
        key: 'TM.SYMBOL.SETTING'
      },
      {
        label: i18n['menu.twapp.trade_time_setting'],
        link: '/home/twapp/tradeTimeSetting',
        key: 'TM.TRADETIME.SETTING'
      },
      {
        label: i18n['menu.twapp.day_off_setting'],
        link: '/home/twapp/dayOffSetting',
        key: 'TM.HOLIDAY.SETTING'
      },
      {
        label: i18n['menu.twapp.custome_service_contact_setting'],
        link: '/home/twapp/customeServiceContactSetting',
        key: 'TM.CONTACTS.SETTING'
      },
      {
        label: i18n['menu.twapp.quotation_interval_setting'],
        link: '/home/twapp/quotationInterval',
        key: 'TM.QUOTEPERIOD.SETTING'
      },
      {
        label: i18n['menu.twapp.monthly_flow_report'],
        link: '/home/twapp/monthlyFlowReport',
        key: 'TM.QUOTEPERIOD.SETTING'
      },
      {
        label: i18n['menu.twapp.follow_order_setting'],
        eventKey: 'twapp-followOrder',
        default: true,
        subMenu: [
          {
            label: i18n['menu.twapp.symbol_setting'],
            link: '/home/twapp/followOrder/symbolSetting',
            default: true
          },
          {
            label: i18n['menu.twapp.server_setting'],
            link: '/home/twapp/followOrder/connectorSetting',
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
        key: 'DW.TENANT.DETAIL'
      },
      {
        label: i18n['menu.dealer.month_report'],
        link: '/home/dealer/monthReport',
        key: 'DW.MONTH.REPORT'
      }
    ]
  }
];
