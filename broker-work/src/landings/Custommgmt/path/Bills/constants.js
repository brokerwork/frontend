import i18n from 'utils/i18n';
import NumberInput from 'components/NumberInput';

const required = {
  validateType: {
    required: true
  }
};
const select = {
  fieldType: 'select',
  optionList: []
};

export const BILL_FIELDS_MAP = {
  to: { label: i18n['customer.bill.to'] },
  toAddress: { label: i18n['customer.bill.to_address'] },
  invoiceDate: { label: i18n['customer.bill.invoice_date'] },
  expDate: { label: i18n['customer.bill.exp_date'] },
  invoices: { label: i18n['customer.bill.invoices'] },
  discount: { label: i18n['customer.bill.discount_field'] },
  taxRate: { label: i18n['customer.bill.tax_rate_field'] },
  payInfos: { label: i18n['customer.bill.payment_information'] },
  from: { label: i18n['customer.bill.from'] },
  fromAddress: { label: i18n['customer.bill.from_address'] },
  totalAmount: { label: i18n['customer.bill_field.account_total_amount'] }
};

export const COMPANY_INFO = {
  from: 'Lean Work HK Limited',
  fromAddress: 'Flat 2, 19/F Henan bldg 90-92, Jaffe RD Wanchai, Hong Kong',
  payInfos: [
    { name: 'Beneficiary', info: 'Lean Work HK Limited' },
    { name: 'Beneficiary’s Bank', info: 'Silicon Valley Bank' },
    { name: 'Account Number', info: '3301303655' },
    {
      name: 'Bank Address',
      info: '3003 Tasman Drive， Santa Clara， Ca 95054， USA'
    },
    { name: 'Swift Code', info: 'SVBKUS6S' }
  ]
};

//生成国际化label 如：customer.product_list.BW.incubation

const typeFactory = (prefix, types) =>
  types.map(type => ({
    label: i18n[`customer.product_list.${prefix}.${type}`],
    value: `${prefix}.${type}`
  }));

export const PRODUCT_LIST = [
  {
    value: 'TW',
    label: 'Trader Work',
    types: typeFactory('TW', [
      'incubation',
      'start_up_broker',
      'mature_broker',
      'user_package',
      'live_video',
      'payment',
      'trade_fee',
      'value_added_services'
    ])
  },
  {
    value: 'BW',
    label: 'Broker Work',
    types: typeFactory('BW', [
      'incubation',
      'start_up_broker',
      'mature_broker',
      'user_package',
      'real_time_commission',
      'smart_business',
      'digital_marketing',
      'trade_server',
      'mail_package',
      'message_package',
      'bw_api',
      'ip_phone',
      'value_added_services'
    ])
  },
  {
    value: 'FW',
    label: 'Feed Work',
    types: typeFactory('FW', [
      'incubation',
      'standard',
      'trade_symbols',
      'trade_link',
      'k_line_history',
      'tick_history'
    ])
  },
  {
    value: 'GW',
    label: 'Bridge Work',
    types: typeFactory('GW', [
      'query',
      'trade',
      'trade_fee',
      'trade_server',
      'trade_link',
      'special_line'
    ])
  },
  {
    value: 'TM',
    label: 'Trader Work Mobile',
    types: typeFactory('TM', ['installation_fee', 'traffic_fee'])
  },
  {
    value: 'DW',
    label: 'Dealer Work',
    types: typeFactory('DW', [
      'incubation',
      'start_up_broker',
      'mature_broker',
      'lp_fix',
      'trade_fee',
      'customization_develop'
    ])
  },
  {
    value: 'MT',
    label: 'Meta Trader',
    types: typeFactory('MT', [
      'collocation',
      'set_up',
      'operation',
      'customization_develop'
    ])
  }
];
