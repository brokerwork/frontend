import i18n from 'utils/i18n';
import NumberInput from 'components/NumberInput';
import cs from './components/EditForm/EditForm.less';

const required = {
  validateType: {
    required: true
  }
};
const select = {
  fieldType: 'select',
  optionList: []
};

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

export const REFUND_PERIOD = [
  {
    value: 'month',
    label: i18n['customer.contract_field.refundPeriod.month']
  },
  {
    value: 'quarter',
    label: i18n['customer.contract_field.refundPeriod.quarter']
  },
  {
    value: 'semiAnnual',
    label: i18n['customer.contract_field.refundPeriod.semiAnnual']
  },
  {
    value: 'annual',
    label: i18n['customer.contract_field.refundPeriod.annual']
  }
];

export const CONTRACT_FIELDS_MEDIATOR = {
  mediatorName: {
    label: i18n['customer.contract_field.mediatorName']
  },
  mediatorAccount: {
    label: i18n['customer.contract_field.mediatorAccount']
  },
  mediatorBankAddr: {
    label: i18n['customer.contract_field.mediatorBankAddr']
  }
};

export const CONTRACT_FIELDS_MAP = {
  contracstNo: {
    label: i18n['customer.contract_field.contract_no'],
    ...required
  },
  contractsName: {
    label: i18n['customer.contract_field.contract_name'],
    ...required
  },
  customerName: {
    label: i18n['customer.contract_field.customer_name'],
    readonly: true,
    ...required
  },
  opportunityId: {
    label: i18n['customer.contract_field.opportunity'],
    ...select
  },
  products: {
    label: i18n['customer.contract_field.products'],
    ...select,
    fieldType: 'multiSelect',
    optionList: PRODUCT_LIST,
    ...required
  },
  period: {
    label: i18n['customer.contract_field.period'],
    fieldType: 'period',
    component: {
      key: 'period',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <NumberInput
              integer={true}
              className={cs['num-input']}
              {...input}
              disabled={disabled}
            />
            <div>{i18n['customer.contract_field.period.unit']}</div>
          </div>
        );
      }
    }
  },
  startTime: {
    label: i18n['customer.contract_field.contract_date.start'],
    fieldType: 'datestring'
  },
  endTime: {
    label: i18n['customer.contract_field.contract_date.end'],
    fieldType: 'datestring'
  },
  totalAmount: {
    label: i18n['customer.contract_field.contract_amount'],
    fieldType: 'totalAmount',
    component: {
      key: 'totalAmount',
      factory: (input, disabled) => {
        return <NumberInput {...input} disabled={disabled} />;
      }
    },
    ...required
  },
  refundPeriod: {
    label: i18n['customer.contract_field.refundPeriod'],
    ...select,
    ...required,
    optionList: REFUND_PERIOD
  },
  hasMediator: {
    label: i18n['customer.contract_field.hasMediator'],
    fieldType: 'radio',
    optionList: [
      { value: true, label: i18n['general.yes'] },
      { value: false, label: i18n['general.no'] }
    ]
  },
  associates: {
    label: i18n['customer.contract_field.associates'],
    fieldType: 'radio',
    optionList: [
      { value: true, label: i18n['general.yes'] },
      { value: false, label: i18n['general.no'] }
    ]
  },
  ...CONTRACT_FIELDS_MEDIATOR,
  accessorys: {
    label: i18n['customer.contract_field.accessorys.license'],
    fieldType: 'multiFile',
    fileExtensions: ['jpg', 'png', 'jpeg'],
    uploadSizeLimit: 20 * 1024 * 1024,
    ...required
  },
  certificate: {
    label: i18n['customer.contract_field.accessorys.certificate'],
    fieldType: 'multiFile',
    fileExtensions: ['jpg', 'png', 'jpeg'],
    uploadSizeLimit: 20 * 1024 * 1024
  }
};
