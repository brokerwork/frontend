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

export const REFUND_FIELDS_MAP = {
  billNo: {
    label: i18n['customer.bill_field.bill_no'],
    readonly: true,
    ...required
  },
  refundAmount: {
    label: i18n['customer.bill_field.amount'],
    fieldType: 'refundAmount',
    component: {
      key: 'refundAmount',
      factory: (input, disabled) => {
        return <NumberInput {...input} disabled={disabled} />;
      }
    },
    ...required
  },
  refundDate: {
    label: i18n['customer.bill_field.date'],
    fieldType: 'datestring',
    ...required
  },
  refundType: {
    label: i18n['customer.bill_field.type']
  },
  refundComment: {
    label: i18n['customer.bill_field.comment']
  }
};

export const REFUND_CURRENCY_LIST = [
  { label: 'USD', value: 'USD' }
  // { label: 'EUR', value: 'EUR' }
];

export const ACTUAL_CURRENCY_LIST = [
  { label: 'USD', value: 'USD' },
  // { label: 'EUR', value: 'EUR' },
  { label: 'RMB', value: 'RMB' }
];

export const HAS_MEDIATOR_LIST = [
  { label: i18n['general.yes'], value: true },
  { label: i18n['general.no'], value: false }
];

export const FUND_TYPE_LIST = [
  {
    label: i18n['customer.bill_field.fundType.downPayment'],
    value: 'downPayment'
  },
  { label: i18n['customer.bill_field.fundType.advance'], value: 'advance' },
  { label: i18n['customer.bill_field.fundType.renew'], value: 'renew' },
  { label: i18n['customer.bill_field.fundType.append'], value: 'append' },
  { label: i18n['customer.bill_field.fundType.other'], value: 'other' }
];

export const REFUND_TYPE_LIST = [
  { label: i18n['customer.bill_field.refundType.online'], value: 'online' },
  {
    label: i18n['customer.bill_field.refundType.usdAccount'],
    value: 'usdAccount'
  },
  { label: i18n['customer.bill_field.refundType.other'], value: 'other' }
];
