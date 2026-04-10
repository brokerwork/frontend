import i18n from 'utils/i18n';
import moment from 'moment';

export const CUSTOMER_STATE_TYPES = [
  { label: i18n['customer.state_type'], value: '' },
  { label: i18n['customer.state_type.clue'], value: 'Clue', disabled: true },
  {
    label: i18n['customer.state_type.potential'],
    value: 'Potential',
    disabled: true
  },
  { label: i18n['customer.state_type.signed'], value: 'Signed' },
  { label: i18n['customer.state_type.payed'], value: 'Payed' }
];

export const PRODUCT_LIST = [
  {
    value: '',
    label: i18n['report.payment.action.product_all']
  },
  {
    value: 'TW',
    label: 'Trader Work'
  },
  {
    value: 'BW',
    label: 'Broker Work'
  },
  {
    value: 'FW',
    label: 'Feed Work'
  },
  {
    value: 'GW',
    label: 'Bridge Work'
  },
  {
    value: 'TM',
    label: 'Trader Work Mobile'
  },
  {
    value: 'DW',
    label: 'Dealer Work'
  },
  {
    value: 'MT',
    label: 'Meta Trader'
  }
];

export const REPORT_TYPES = [
  {
    label: i18n['report.payment.action.filter.refund_bill'],
    value: 'refund_bill'
  },
  { label: i18n['report.payment.action.filter.refund'], value: 'refund' },
  { label: i18n['report.payment.action.filter.bill'], value: 'bill' },
  { label: i18n['report.payment.action.filter.income'], value: 'income' }
];

export const TIME_UNITS = [
  { label: i18n['report.payment.action.time_unit.month'], value: 'month' },
  { label: i18n['report.payment.action.time_unit.quarter'], value: 'quarter' },
  { label: i18n['report.payment.action.time_unit.year'], value: 'year' }
];

export const FUZZY_ITEM_LIST = [
  {
    label: i18n['report.payment.action.search_field.customer_name'],
    value: 'CustomerName'
  },
  {
    label: i18n['report.payment.action.search_field.customer_no'],
    value: 'CustomerId'
  },
  {
    label: i18n['report.payment.action.search_field.owner_name'],
    value: 'OwnName'
  }
];

// 客户筛选条件
export const FILTER_TYPES = [
  {
    label: i18n['customer.search_type.all'],
    value: 'all',
    right: 'CUSTOMER_SELECT_ALL'
  },
  {
    label: i18n['customer.search_type.direct'],
    value: 'direct',
    right: 'CUSTOMER_SELECT_DIRECTLY'
  },
  {
    label: i18n['customer.search_type.no_direct'],
    value: 'noDirect',
    right: 'CUSTOMER_SELECT_SUBORDINATE'
  },
  {
    label: i18n['customer.search_type.no_belonging'],
    value: 'noBelonging',
    right: 'CUSTOMER_SELECT_WILD'
  },
  { label: i18n['customer.search_type.followed'], value: 'followed' },
  {
    label: i18n['customer.search_type.participant'],
    value: 'participant',
    right: 'CUSTOMER_SELECT_JOIN'
  },
  {
    label: i18n['customer.state_type.subParticipant'],
    value: 'subParticipant',
    right: 'CUSTOMER_SELECT_SUBORDINATEJOIN'
  }
];

//默认时间范围
export const DEFAULT_DATE_RANGE = {};
Object.defineProperties(DEFAULT_DATE_RANGE, {
  startDate: {
    get: () =>
      moment()
        .utcOffset(8)
        .subtract(3, 'months')
        .startOf('day')
        .valueOf()
  },
  endDate: {
    get: () =>
      moment()
        .utcOffset(8)
        .add(2, 'months')
        .endOf('day')
        .valueOf()
  }
});

//时间控件默认选择
const dateRangeObj = {};

Object.defineProperties(dateRangeObj, {
  last3mounth: {
    get: function() {
      return {
        start: moment()
          .subtract(2, 'month')
          .startOf('month'),
        end: moment().endOf('month')
      };
    }
  },
  last6mounth: {
    get: function() {
      return {
        start: moment()
          .subtract(5, 'month')
          .startOf('month'),
        end: moment().endOf('month')
      };
    }
  },
  last12mounth: {
    get: function() {
      return {
        start: moment()
          .subtract(11, 'month')
          .startOf('month'),
        end: moment().endOf('month')
      };
    }
  },
  this_year: {
    get: function() {
      return {
        start: moment().startOf('year'),
        end: moment().endOf('year')
      };
    }
  },
  last_year: {
    get: function() {
      return {
        start: moment()
          .subtract(1, 'year')
          .startOf('year'),
        end: moment()
          .subtract(1, 'year')
          .endOf('year')
      };
    }
  }
});

export const DEFAULT_DATE_PICKER_RANGES = {
  year: {
    [i18n['report.date_range_picker.option.this_year']]: dateRangeObj.this_year,
    [i18n['report.date_range_picker.option.last_year']]: dateRangeObj.last_year
  },
  month: {
    [i18n['report.date_range_picker.option.last3mounth']]:
      dateRangeObj.last3mounth,
    [i18n['report.date_range_picker.option.last6mounth']]:
      dateRangeObj.last6mounth,
    [i18n['report.date_range_picker.option.last12mounth']]:
      dateRangeObj.last12mounth,
    [i18n['report.date_range_picker.option.this_year']]: dateRangeObj.this_year,
    [i18n['report.date_range_picker.option.last_year']]: dateRangeObj.last_year
  },
  quarter: {
    [i18n['report.date_range_picker.option.this_year']]: dateRangeObj.this_year,
    [i18n['report.date_range_picker.option.last_year']]: dateRangeObj.last_year
  }
};

export const BILL_REFUND_VIEWS = [
  { label: i18n['report.payment.action.bill_refund.mrr'], value: 'MRR' },
  { label: i18n['report.payment.action.bill_refund.actual'], value: 'ACTUAL' }
];
