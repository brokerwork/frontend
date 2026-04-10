//综合报表专属搜索字段
import i18n from 'utils/i18n';
export const CUSTOMER_SIGNING_TYPE = [
  {
    label: i18n['report.customer_signing_performance.customer_state'],
    value: ''
  },
  {
    label: i18n['report.customer_signing_performance.paying_client'],
    value: 'Payed'
  },
  {
    label: i18n['report.customer_signing_performance.custmor'],
    value: 'Signed'
  }
];
export const PAYMENT_STATUS = [
  {
    label: i18n['report.customer_signing_performance.payment_state'],
    value: ''
  },
  {
    label: i18n['report.customer_signing_performance.paid_off'],
    value: 'paid'
  },
  { label: i18n['report.customer_signing_performance.unpaid'], value: 'unPay' }
];
export const PAYMENT_TIME_OPTIONS = [
  {
    label: i18n['report.customer_signing_performance.frist_payment_start_time'],
    value: 'bill_start_time'
  },
  {
    label: i18n['report.customer_signing_performance.frist_pay_time'],
    value: 'first_refund_time'
  }
];

export const PAYMENT_SEARCH_OPTIONS = [
  {
    label: i18n['report.customer_signing_performance.customer_name'],
    value: 'CustomerName'
  },
  {
    label: i18n['report.customer_signing_performance.customer_no'],
    value: 'CustomerId'
  },
  {
    label: i18n['report.customer_signing_performance.owner_name'],
    value: 'OwnName'
  }
];

export const CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER = [
  {
    label: i18n['report.customer_signing_performance.customer_name'],
    value: 'customerName'
  },
  {
    label: i18n['report.customer_signing_performance.customer_no'],
    value: 'customerNo'
  },
  {
    label: i18n['report.customer_signing_performance.customer_state'],
    value: 'customerState'
  },
  {
    label: i18n['report.customer_signing_performance.owner'],
    value: 'oweName'
  },
  {
    label: i18n['report.customer_signing_performance.frist_pay_time'],
    value: 'firstPayTime',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.frist_payment_start_time'],
    value: 'firstBillTime',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.payment_total'],
    value: 'billTotal',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.life_circle'],
    value: 'lifeCycle',
    sort: true
  },
  {
    label:
      i18n[
        'report.customer_signing_performance.total_amount_of_historical_returns'
      ],
    value: 'refundTotal',
    sort: true
  },
  {
    label:
      i18n[
        'report.customer_signing_performance.total_amount_of_current_returns'
      ],
    value: 'billReceivable',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.payment_state'],
    value: 'payState'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.action'],
    value: 'action'
  }
];
export const INNER_CUSTOMER_SIGNING_PERFORMANCE_REPORT_HEDER = [
  {
    label: i18n['report.customer_signing_performance.payment_no'],
    value: 'billNo'
  },
  {
    label: i18n['report.customer_signing_performance.bill_generation_time'],
    value: 'createTime',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.bill_deadline'],
    value: 'expDate',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.purchased_product'],
    value: 'serviceType'
  },
  {
    label: i18n['report.customer_signing_performance.product_type'],
    value: 'type'
  },
  {
    label: i18n['report.customer_signing_performance.service_start_time'],
    value: 'invoicedate'
  },
  {
    label: i18n['report.customer_signing_performance.service_end_time'],
    value: 'endDate'
  },
  {
    label: i18n['report.customer_signing_performance.price'],
    value: 'unitPrice'
  },
  {
    label: i18n['report.customer_signing_performance.quantity'],
    value: 'num'
  },
  {
    label: i18n['report.customer_signing_performance.total'],
    value: 'extendedPrice'
  },
  {
    label: i18n['report.customer_signing_performance.accounts_receivable'],
    value: 'billReceivable'
  },
  {
    label: i18n['report.customer_signing_performance.discount'],
    value: 'discount'
  },
  {
    label: i18n['report.customer_signing_performance.tax_rate'],
    value: 'taxRate'
  },
  {
    label: i18n['report.customer_signing_performance.total_payment'],
    value: 'totalAmount',
    sort: true
  },
  {
    label: i18n['report.customer_signing_performance.payment_state'],
    value: 'payState'
  },
  {
    label:
      i18n['report.customer_signing_performance.amount_of_current_returns'],
    value: 'refundTotal'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.action'],
    value: 'action'
  }
];

// 客户筛选条件
export const ACTION_BAR_SEARCH_TYPE = [
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

export const PRODUCT_LIST = [
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
