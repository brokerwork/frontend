import { shallow } from 'enzyme';
import DetailModal from '../index.js';
import moment from 'moment';
import { resolve } from 'path';
import { LOTS_DETAIL_TABLE } from '../../../../../constant';

const props = {
  serverList: [{ label: 'mt4-100', value: '454', vendor: 'MT4' }],
  brandInfo: {
    background: '',
    companyEmail: 'support@lwork.com',
    companyName: 'LEAN WORK',
    companySite: 'www.lwork.com',
    customerDomain: '1124.btmsc.lwork.com',
    inner: false,
    mode: 'MULTI_AGENT',
    productDomain: 'bwokow74.btmsc.lwork.com',
    productIcon:
      '//broker-upload.oss-cn-hangzhou.aliyuncs.com/test/01cc0f9c-722d-4783-b1f0-0f593cdf586f.ico',
    productLogo:
      '//broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/logo.png',
    pubKey:
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxq+EkcWV+gB/B81dqK+WJM1/0qgCS0uFodLv/uygtNTKf4mbHwfy/90SPILkpqkO31F3B5MYyLkl9MQFuA9DD95fcFOQFL7wEUnAtnGbzRbVCqo2JcUpyWV79LDeFlsL87NMvwtIGf5geEDLLPT7WS63X6o3LAaWrro3Z/rzf6zwKSWnzoMhjcrV6inmOkLGpOMQxwOgteaLmYvJ8x3BayokTGRDOH2JMMw49C9c5S2mwJ+axkAdi0ei83Y5K5WcCEbxeNaxZiDZs9HN428/QJtOtcXPtp0PyUH3449ycwBjYF+HHjxihvs/PzI/agPWVtE4hGba1Ldya5JMGh7KKQIDAQAB',
    releaseNotice: '',
    showPoweredBy: false,
    siteName: 'Broker Work - 经纪商管理后台',
    tenantId: 'T001124',
    tenantName: 'jason',
    tenantType: 'normal',
    tpId: '58b5116e49d8230a2ed87825'
  },
  innerDetailList: {},
  currentServer: { label: 'mt4-100', value: '454', vendor: 'MT4' },
  currentListDetailType: 'LotsDetail',
  currentPrivilegeType: [
    { label: '归属给我的账户', value: 'sub', right: 'STAT_VIEW_ACC_RANGE_MY' },
    { label: '归属给下级的账户', value: 'subBelong', right: 'STAT_VIEW_ACC_RANGE_SUB' },
    { label: '无归属账户', value: 'noParent', right: 'STAT_VIEW_ACC_RANGE_NO' },
    { label: '所有账户', value: 'all', right: 'STAT_VIEW_ACC_RANGE_ALL' }
  ],
  statisticalReportType: [
    {
      label: '综合账户报表',
      value: 'AccountSummary',
      right: 'STAT_VIEW_ACC_REPORTTYPE_ZACC'
    },
    {
      label: '账户资金报表',
      value: 'AccountDw',
      right: 'STAT_VIEW_ACC_REPORTTYPE_FUND'
    },
    {
      label: '持仓查询',
      value: 'Position',
      right: 'STAT_VIEW_ACC_REPORTTYPE_POSITION'
    },
    { label: '挂单查询', value: 'Order', right: 'STAT_VIEW_ACC_REPORTTYPE_GUADAN' },
    {
      label: '交易历史查询',
      value: 'HistoryOrder',
      right: 'STAT_VIEW_ACC_REPORTTYPE_HISTORY'
    },
    {
      label: '品种佣金报表',
      value: 'SymbolGroup',
      right: 'STAT_VIEW_COMMISSION_REPORTTYPE_VCR'
    },
    {
      label: '止损止盈单查询',
      value: 'StopLimit',
      right: 'STAT_VIEW_ACC_REPORTTYPE_SLCS'
    },
    { label: '新账户报表', value: 'NewUser', right: 'STAT_VIEW_ACC_REPORTTYPE_NAR' }
  ],
  currentObjectType: { label: 'YL5L 4级', value: 6 },
  currentStatisticalReportType: {
    label: '综合账户报表',
    value: 'AccountSummary',
    right: 'STAT_VIEW_ACC_REPORTTYPE_ZACC'
  },
  currentCommissionReportType: {
    label: '交易返佣报表',
    value: 'Lots',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_TRADE'
  },
  dateRange: {
    startDate: moment('2017-10-24T16:00:00.000Z'),
    endDate: moment('2017-11-23T15:59:59.999Z')
  },
  detailListColumns: [
    { label: '', value: 'fold' },
    { label: '规则名称', value: 'name' },
    { label: '品种组', value: 'symbol_group' },
    { label: '手数', value: 'close_volume' },
    { label: '处理数', value: 'open_close_volume' },
    { label: '返佣', value: 'money' },
    { label: '操作', value: 'action' }
  ],
  detailList: {
    list: [
      {
        close_volume: 3,
        money: 21,
        symbol_group: '全部品种',
        name: '上-4-$-手',
        id: '1',
        open_close_volume: 6
      },
      {
        close_volume: 3,
        money: 36,
        symbol_group: '全部品种',
        name: '上-null-$-处理',
        id: '2',
        open_close_volume: 6
      },
      {
        close_volume: 3,
        money: 0.05,
        symbol_group: '全部品种',
        name: '下-1-%-手',
        id: '4',
        open_close_volume: 6
      }
    ],
    offset: 0,
    pager: 1,
    pages: 0,
    size: 100,
    sta: {
      sum_close_volume_4: 3,
      columns: [
        { children: [], displayName: '账号归属', property: 'parent_name' },
        { children: [], displayName: '账号', property: 'login' },
        { children: [], displayName: '账户名称', property: 'name' },
        {
          children: [],
          displayName: '上-4-$-手(手数)',
          property: 'close_volume_1'
        },
        { children: [], displayName: '上-4-$-手(内返)', property: 'money_1' },
        {
          children: [],
          displayName: '上-null-$-处理(手数)',
          property: 'open_close_volume_2'
        },
        { children: [], displayName: '上-null-$-处理(内返)', property: 'money_2' },
        {
          children: [],
          displayName: '下-2-pip-手(手数)',
          property: 'close_volume_3'
        },
        { children: [], displayName: '下-2-pip-手(内返)', property: 'money_3' },
        {
          children: [],
          displayName: '下-1-%-手(手数)',
          property: 'close_volume_4'
        },
        { children: [], displayName: '下-1-%-手(内返)', property: 'money_4' },
        {
          children: [],
          displayName: '下-s-$-处理(手数)',
          property: 'open_close_volume_5'
        },
        { children: [], displayName: '下-s-$-处理(内返)', property: 'money_5' },
        { children: [], displayName: '合计', property: 'row_heji' }
      ],
      sum_close_volume_3: 3,
      rules: [
        { $ref: '$.data.list[0]' },
        { $ref: '$.data.list[1]' },
        { name: '下-2-pip-手', id: '3' },
        { $ref: '$.data.list[2]' },
        { name: '下-s-$-处理', id: '5' }
      ],
      create_time_to: '2017-11-23',
      login: '3009',
      serverId: '454',
      objectType: '6',
      reportType: 'Lots',
      sum_money_1: 21,
      sum_money_2: 36,
      sortDirection: 'asc',
      my_user_id: '6',
      id: '',
      exp: '0',
      lang: 'zhCN',
      mt_real: 'mt4',
      accountQueryItem: '',
      volume_display: true,
      sum_row_heji: 57.05,
      mt: 'mt4',
      sum_money_5: 0,
      sum_money_3: 0,
      sum_money_4: 0.05,
      accountQueryValue: '',
      myPubId: '7ecbbb8b-1656-425c-bdab-13b29f494590',
      sum_open_close_volume_2: 6,
      sum_open_close_volume_5: 6,
      create_time_from: '2017-10-25',
      open_close_volume_display: true
    },
    total: 0
  },
  symbolId: '',
  currentCommissionItemLogin: 3009,
  commissionListColumns: [
    { label: '返佣用户', value: 'commission_user' },
    { label: '账户归属', value: 'parent_name' },
    { label: '账号', value: 'login' },
    { label: '姓名', value: 'name' },
    { label: '关联客户', value: 'customer_name' },
    { label: '合计手数', value: 'row_heji_volume', sort: true },
    { label: '合计处理数', value: 'row_heji_open_close_volume', sort: true },
    { label: '返佣', value: 'row_heji_money', sort: true },
    { label: '操作', value: 'action' }
  ]
};

function getInnerDetailList() {
  return Promise.resolve({
    result: true,
    data: {
      list: [
        {
          open_date: '2017-11-15',
          symbol: 'USDJPY',
          close_date: '2017-11-15 06:07:06',
          ticket: 36555202,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        },
        {
          open_date: '2017-11-15',
          symbol: 'EURUSD',
          close_date: '2017-11-15 05:57:33',
          ticket: 36555185,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        },
        {
          open_date: '2017-11-15',
          symbol: 'EURUSD',
          close_date: '2017-11-15 03:18:43',
          ticket: 36555162,
          rule_name: '上-4-$-手',
          account_group_id: 0,
          close_volume_pt: 0.0,
          open_volume_pt: 0.0,
          login: 3009,
          balance_unit: '1',
          volume: 1.0,
          close_volume: 1.0,
          parent_id: 6,
          balance_type: '$',
          commission: 7.0,
          detail_value: '7',
          money_1: 7.0,
          open_close_volume: 2.0,
          group: 'ATEST'
        }
      ],
      offset: 0,
      pager: 1,
      pages: 1,
      size: 20,
      sta: {
        create_time_to: '2017-11-23',
        login: '3009',
        serverId: '454',
        objectType: '6',
        reportType: 'LotsDetailOrder',
        sortDirection: 'asc',
        my_user_id: '6',
        balance_type: '2',
        id: '1',
        exp: '0',
        lang: 'zhCN',
        mt_real: 'mt4',
        accountQueryItem: '',
        mt: 'mt4',
        balance_unit: '1',
        accountQueryValue: '',
        myPubId: '7ecbbb8b-1656-425c-bdab-13b29f494590',
        reporttype_lots_detail_adapter_totalNumberOfEntries: '3',
        create_time_from: '2017-10-25'
      },
      total: 3
    },
    mcode: 'm0000000',
    result: true,
    time: 1511435926225
  });
}

describe('tw佣金报表明细查看', () => {
  const wrap = shallow(
    <DetailModal {...props} getInnerDetailList={getInnerDetailList} />
  );
  describe('初始状态', () => {
    it('渲染正常', () => {
      expect(wrap.find('[data-test="commissionModal"]').exists()).toBe(true);
    });
    it('明细未展开', () => {
      const listIsActive = wrap
        .find('[data-test="foldButton"]')
        .map(node => node.hasClass('active'));
      expect(listIsActive[0]).toBe(false);
    });
    it('点击展开', () => {
      const button0 = wrap.find('[data-test="foldButton"]').at(0);
      const item0 = wrap.state().detailListState[0];
      button0.simulate('click');
      Promise.resolve().then(() => {
        expect(item0.foldOpen).toBe(true);
      });
    });
  });
  describe('点击展开时表中表明细', () => {
    it('应该增加了开仓时间字段', () => {
      LOTS_DETAIL_TABLE.forEach(item => {
        if (item.value === 'open_date') {
          expect(item.value).toEqual('open_date');
        }
      });
    });
  });
});
