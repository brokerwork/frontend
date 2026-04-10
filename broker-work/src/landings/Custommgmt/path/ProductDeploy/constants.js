import i18n from 'utils/i18n';
import NumberInput from 'components/NumberInput';
import cs from './components/EditFooterForm/EditFooterForm.less';

const required = {
  validateType: {
    required: true
  }
};
const select = {
  fieldType: 'select',
  optionList: []
};

export const PRODUCT_NAMES = [
  {
    value: 'bwIncubation50',
    label: i18n['customer.deploy_field.productName.bwIncubation50']
  },
  {
    value: 'bwStandard200',
    label: i18n['customer.deploy_field.productName.bwStandard200']
  },
  {
    value: 'bwSimple100',
    label: i18n['customer.deploy_field.productName.bwSimple100']
  },
  {
    value: 'twStandard1000',
    label: i18n['customer.deploy_field.productName.twStandard1000']
  },
  {
    value: 'twSimple500',
    label: i18n['customer.deploy_field.productName.twSimple500']
  },
  {
    value: 'dw',
    label: 'Dealer Work'
  },
  {
    value: 'fw',
    label: 'Feed Work'
  },
  {
    value: 'bw',
    label: 'Bridge Work'
  },
  {
    value: 'bwCommission',
    label: i18n['customer.deploy_field.productName.bwCommission']
  }
];

export const APPEND_PROJECTS = [
  {
    value: 'bwUserCount',
    label: i18n['customer.deploy_field.append.bwUserCount']
  },
  {
    value: 'twUserCount',
    label: i18n['customer.deploy_field.append.twUserCount']
  }
];

export const DEPLOY_TYPE = [
  {
    value: 'BW_TW',
    label: 'Broker Work/Trader Work'
  },
  {
    value: 'FW_GW',
    label: 'Feed Work/Bridge Work'
  },
  {
    value: 'DW',
    label: 'Dealer Work'
  }
];

export const EDIT_HEADER_FIELDS_MAP = {
  deployTypeName: {
    label: i18n['customer.deploy_field.scheme'],
    readonly: true,
    ...required
  }
};

export const PRODUCT_DETAILS_FIELDS_MAP = {
  productName: {
    label: i18n['customer.deploy_field.productName'],
    ...select,
    ...required,
    optionList: PRODUCT_NAMES
  },
  append: {
    label: i18n['customer.deploy_field.append'],
    ...select,
    optionList: APPEND_PROJECTS
  },
  appendNum: {
    label: i18n['customer.deploy_field.appendNum'],
    fieldType: 'appendNum',
    component: {
      key: 'appendNum',
      factory: (input, disabled) => {
        return (
          <NumberInput
            integer={true}
            className={cs['num-input']}
            {...input}
            disabled={disabled}
          />
        );
      }
    }
  }
};

export const EDIT_FOOTER_FIELDS_MAP = {
  commission: {
    label: i18n['customer.deploy_field.commission'],
    fieldType: 'radio',
    optionList: [
      { value: true, label: i18n['general.yes'] },
      { value: false, label: i18n['general.no'] }
    ]
  },
  payment: {
    label: i18n['customer.deploy_field.payment'],
    fieldType: 'radio',
    optionList: [
      { value: true, label: i18n['general.yes'] },
      { value: false, label: i18n['general.no'] }
    ]
  },
  transfer: {
    label: i18n['customer.deploy_field.transfer'],
    fieldType: 'radio',
    optionList: [
      { value: true, label: i18n['general.yes'] },
      { value: false, label: i18n['general.no'] }
    ]
  },
  period: {
    label: i18n['customer.deploy_field.period2'],
    ...required,
    fieldType: 'period',
    component: {
      key: 'period',
      factory: (input, disabled) => {
        return (
          <NumberInput
            className={cs['num-input']}
            {...input}
            disabled={disabled}
          />
        );
      }
    }
  },
  payTime: {
    label: i18n['customer.deploy_field.payDate'],
    fieldType: 'datestring'
  },
  remark: {
    label: i18n['customer.deploy_field.remark']
  },
  documents: {
    label: i18n['customer.deploy_field.documents'],
    fieldType: 'multiFile',
    fileExtensions: ['jpg', 'png', 'jpeg'],
    uploadSizeLimit: 20 * 1024 * 1024,
    ...required
  },
  deploys: {
    label: i18n['customer.deploy_field.deploys'],
    fieldType: 'multiFile',
    fileExtensions: ['jpg', 'png', 'jpeg'],
    uploadSizeLimit: 20 * 1024 * 1024,
    ...required
  }
};
