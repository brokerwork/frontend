import { shallow } from 'enzyme';
import ActionsBar from '../index.js';
import Dropdown, { DropdownForCode } from 'components/Dropdown';
import DateRangePicker from 'components/DateRangePicker';
import UserLevelSelector from 'components/UserLevelSelector';
import { dateRange } from 'utils/config';
import i18n from 'utils/i18n';
import moment from 'moment';
import {
  DEFAULT_SEARCH_TYPE,
  SPECIAL_SEARCH_TYPE,
  ACCOUNTSUMMARY_HEADER,
  ACCOUNTDW_HEADER,
  POSITION_HEADER,
  ORDER_HEADER,
  HISTORYORDER_HEADER,
  STOP_LOSS_HEADER,
  SYMBOL_HEADER,
  NEW_USER_HEADER,
  SYMBOL_SEARCH_TYPE,
  CTRADER_NOSHOW_TYPE
} from '../../../../../constant';

import AdvancedSearch from 'components/AdvancedSearch';

describe('账户报表actionbar', () => {
  const defaultOptions = {
    label: i18n['report.account_table_type.accounts_summary'],
    value: 'AccountSummary',
    right: 'STAT_VIEW_ACC_REPORTTYPE_ZACC'
  };
  const options = {
    label: i18n['report.account_table_type.variety_group'],
    value: 'SymbolGroup',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_VCR'
  };
  const dateRanges = {
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day')
  };
  const { startDate, endDate } = dateRanges;
  const wrap = shallow(
    <ActionsBar
      currentStatisticalReportType={options}
      startDate={startDate}
      endDate={endDate}
      dateRanges={dateRanges}
      advancedSearchType={[]}
      userRights={[]}
      currentServer={{}}
    />
  );
  it('当报表类型变成品种佣金报表时应该有合计开仓手数和合计平仓手数字段', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: SYMBOL_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (item.value === 'open_volume') {
        expect(item.value).toEqual('open_volume');
      }
    });
  });

  it('当报表类型变成账户资金报表应该有订单号字段', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: ACCOUNTDW_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (item.value === 'ticket') {
        expect(item.value).toEqual('ticket');
      }
    });
  });

  it('交易历史的排序字段开仓时间，平仓时间', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: HISTORYORDER_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['close_time', 'open_time'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });

  it('账户资金报表的排序字段入金，出金，操作时间', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: ACCOUNTDW_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['d', 'w', 'open_time'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });

  it('持仓查询的排序字段开仓时间，可用保证金', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: POSITION_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['margin_free', 'open_time'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });

  it('挂单查询的排序字段挂单时间', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: ORDER_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['open_time'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });

  it('止损止盈查询的排序字段交易量，开仓时间，盈亏', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: STOP_LOSS_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['volume', 'open_time', 'profit'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });

  it('新账户查询的排序字段净值，开仓时间，余额', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: NEW_USER_HEADER
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (['balance', 'open_time', 'equity'].includes(item.value)) {
        expect(item.sort).toEqual(true);
      }
    });
  });
  it('当报表类型变成交易历史字段，且server变成mt5, 应该搜索字段存在开仓平仓字段', () => {
    wrap.setProps({
      currentStatisticalReportType: options,
      statisticalListColumns: HISTORYORDER_HEADER,
      currentServer: { label: 'MT5实盘', value: '634', vendor: 'MT5' }
    });
    wrap.update();
    wrap.instance().props.statisticalListColumns.forEach(item => {
      if (item.value === 'open_close') {
        expect(item.value).toEqual('open_close');
      }
    });
  });
});
