import { reduxForm, field } from 'redux-form';
import { Input } from 'lean-ui';
import { FormattedMessage } from 'react-intl';

import CustomField, { validate } from 'components/v2/CustomField';
import emulateFields from 'utils/emulateFields';
import formFields, {
  FIELDS_BANK_CARD,
  FIELDS_CHECK,
  FIELDS_DIGITAL_CASH
} from './fields';
import i18n from 'utils/i18n';
import math from 'utils/math';
import cs from './index.less';
import NumberInput from 'components/v2/NumberInput';
import { BANK_INFO_FIELD_KEYS } from '../../contants';
import _ from 'lodash';
export const APPLY_WITHDRAW_FORM = 'APPLY_WITHDRAW_FORM';
import { getType as getLanguageType } from 'utils/language';

const PICK_FROM_CONFIG_KEYS = {
  bankAddress: 'bankAddress',
  bankSwift: 'swift',
  branchBank: 'bankBranchName'
};
const WITHDRAW_AMOUNT_KEY = 'withdrawAmount';
const BANK_NAME = 'bankName';
const BANK_ACCOUNT_NAME_KEY = 'bankAccountNameKey';
const NUMBER_REGEXP2 = /^(\d+)((?:\.?$)|(?:\.\d{1,2}$))/;
const NUMBER_REGEXP4 = /^(\d+)((?:\.?$)|(?:\.\d{1,4}$))/;
class WithdrawAmount extends Component {
  state = {
    value: undefined
  };
  handleChange = value => {
    const { input } = this.props;
    this.setState({
      value
    });
    input.onChange(value);
  };
  getExchangedAmount = () => {
    const { value } = this.state;
    const { exchangeRate: { exchange, exchangeFloat = 0 } = {} } = this.props;
    if (!exchange) return;
    let reg = this.props.currency === 'BTC' ? NUMBER_REGEXP4 : NUMBER_REGEXP2;
    const isVaild = reg.test(value);
    if (isVaild) {
      return math
        .mul(value, getWithDrawExchange({ exchange, exchangeFloat }))
        .toFixed(this.props.currency === 'BTC' ? 4 : 2);
    }
  };
  render() {
    const {
      input,
      max,
      min,
      disabled,
      exchangeRate,
      maxLength,
      show,
      currency
    } = this.props;
    let exchangedAmount = this.getExchangedAmount();
    if (max || min) {
      input.placeholder = `${
        i18n['withdraw.form.label.withdrawAmount.min']
      }${min},${i18n['withdraw.form.label.withdrawAmount.max']}${max}`;
    }
    return (
      <div>
        <NumberInput
          {...input}
          decimal={currency === 'BTC' ? '{1,4}' : '{1,2}'}
          maxLength={maxLength}
          onChange={this.handleChange}
          disabled={disabled}
        />
        {typeof exchangedAmount !== 'undefined' &&
        show &&
        exchangeRate.showExchange ? (
          <div>
            <FormattedMessage
              id="withdraw.form.tips.exchangedAmount"
              defaultMessage={i18n['withdraw.form.tips.exchangedAmount']}
              values={{
                currency: `${exchangeRate.payCurrency}`
              }}
            />
            {exchangedAmount}
            {' ('}
            <FormattedMessage
              id="withdraw.form.tips.exchangeRate"
              defaultMessage={i18n['withdraw.form.tips.exchangeRate']}
              values={{
                currency: `${exchangeRate.payCurrency}`
              }}
            />
            {getWithDrawExchange(exchangeRate)}
            {')'}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const ApplyForm = reduxForm({
  form: APPLY_WITHDRAW_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: function(values, props) {
    const commonErrors = validate(values, props);
    const CurrencyReg = /^[A-Za-z]+$/;
    const errors = {};
    console.log('values', props.max, props.min);
    if (!props.reg.test(values['withdrawAmount'])) {
      errors['withdrawAmount'] = i18n['withdraw.form.error_number'];
    } else if (values['withdrawAmount'] > values['accountActualBalance']) {
      errors['withdrawAmount'] = (
        <FormattedMessage
          id="withdraw.form.error_limit"
          defaultMessage={i18n['withdraw.form.error_limit']}
          values={{ name: i18n['withdraw.form.label.accountActualBalance'] }}
        />
      );
    } else if (values['withdrawAmount'] <= 0) {
      errors['withdrawAmount'] = i18n['withdraw.form.error_number'];
    } else if (props.max || props.min) {
      if (
        values.withdrawAmount < props.min ||
        values.withdrawAmount > props.max
      ) {
        errors.withdrawAmount = (
          <FormattedMessage
            id="withdraw.form.label.withdrawAmount.tip"
            defaultMessage={i18n['withdraw.form.label.withdrawAmount.tip']}
            values={{ min: props.min, max: props.max }}
          />
        );
      }
    }
    if (values['payCurrency'] && !CurrencyReg.test(values['payCurrency'])) {
      errors['payCurrency'] = i18n['withdraw.form.error_currency'];
    }
    return Object.assign({}, commonErrors, errors);
  }
})(props => {
  const { fields, disabled, customFormFields } = props;
  return <CustomField fields={fields} disabled={disabled} />;
});

export default class ApplyWithdraw extends PureComponent {
  state = {
    configLoaded: false,
    fields: emulateFields(formFields),
    exchangeRate: {}
  };
  formData = {};
  withdrawType = '';
  onFormChange = values => {
    this.formData = values;
  };
  currencyChange = (values, value) => {
    if (!value) return;
    let exchangeRate = this.props.withDrawConfig.exchangeRateSettings.find(
      el => {
        return (
          el.payCurrency === value &&
          el.transactionCurrency === this.props.rebateAccount.currency
        );
      }
    );

    this.setState(
      {
        exchangeRate,
        fields: this.formatFields()
      },
      () => {}
    );
  };
  withdrawTypeChange = (values, value) => {
    this.withdrawType = value;
    if (!value) {
      return;
    }
    this.props.fetchWithdrawTypeFields(this.props.rebateAccount.vendor, value);
  };
  withdrawAmountGenerator = (maxLength, show, currency, max, min) => {
    return {
      key: WITHDRAW_AMOUNT_KEY,
      factory: (input, disabled) => {
        return (
          <WithdrawAmount
            max={max}
            min={min}
            disabled={disabled}
            input={input}
            show={show}
            maxLength={maxLength}
            exchangeRate={this.state.exchangeRate}
            currency={currency}
          />
        );
      }
    };
  };
  bankAccountNameGenerator = () => {
    return {
      key: BANK_ACCOUNT_NAME_KEY,
      factory: (input, disabled) => {
        return (
          <div>
            <Input {...input} disabled={disabled} />
            <span className={cs['note']}>
              {i18n['withdraw.form.bankAccountName.placeHolder']}
            </span>
          </div>
        );
      }
    };
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.bankEditable !== this.props.bankEditable) {
      setTimeout(() => {
        this.setState({
          fields: this.formatFields()
        });
      });
    }
  }
  componentDidMount() {
    const {
      getBankList,
      getWithdrawConfig,
      rebateAccount,
      getDefaultValues,
      getCustomFormFields,
      getMaxWithdraw,
      rebateAccount: { serverId, vendor, accountId },
      fetchEnableWithdrawList,
      enableWithdrawList
    } = this.props;
    const publicParams = {
      serverId,
      vendor,
      account: accountId
    };
    Promise.all([
      fetchEnableWithdrawList({
        vendor,
        serverId,
        accountId
      }),
      getBankList(),
      getWithdrawConfig(rebateAccount.vendor),
      getDefaultValues(),
      getCustomFormFields(),
      getMaxWithdraw(publicParams)
    ]).then(() => {
      let exchangeRate = {};
      if (
        this.props.withDrawConfig.defaultExchangeRateSetting
          .transactionCurrency === rebateAccount.currency
      ) {
        exchangeRate = this.props.withDrawConfig.defaultExchangeRateSetting;
      } else {
        exchangeRate = this.props.withDrawConfig.exchangeRateSettings.find(
          el => {
            return (
              el.transactionCurrency === rebateAccount.currency && el.status
            );
          }
        );
      }
      const withdrawType = this.props.enableWithdrawList.filter(
        el => el.enabled
      )[0].withdrawType;
      this.withdrawType =
        withdrawType === 'CUSTOMIZE'
          ? this.props.enableWithdrawList.filter(el => el.enabled)[0].typeId +
            '@' +
            withdrawType
          : withdrawType;
      this.withdrawTypeChange({}, this.withdrawType);
      const fields = this.formatFields();
      this.setState({
        configLoaded: true,
        fields,
        exchangeRate
      });
    });
  }
  formatFields = () => {
    const {
      withDrawConfig,
      bankList,
      rebateAccount,
      defaultValues,
      bankEditable,
      customFormFields,
      enableWithdrawList
    } = this.props;
    const fieldsMap = JSON.parse(JSON.stringify(formFields));
    if (withDrawConfig) {
      Object.keys(PICK_FROM_CONFIG_KEYS).forEach(key => {
        const _key = PICK_FROM_CONFIG_KEYS[key];
        if (!fieldsMap[_key]) return;
        fieldsMap[_key].validateType = {
          ...fieldsMap[_key].validateType,
          required: withDrawConfig[key]
        };
      });
      let payCurrencyList = withDrawConfig.exchangeRateSettings
        .filter(el => {
          return el.transactionCurrency === rebateAccount.currency && el.status;
        })
        .map(el => {
          return {
            value: el.payCurrency,
            label: el.payCurrency
          };
        });
      if (!payCurrencyList.length) {
        delete fieldsMap.payCurrency;
      } else {
        fieldsMap.payCurrency.optionList = payCurrencyList;
        fieldsMap.payCurrency.onChange = this.currencyChange;
      }
      fieldsMap.withdrawType.optionList = enableWithdrawList
        .filter(el => el.enabled)
        .map(el => {
          let label = '';
          let value = '';
          if (el.typeId) {
            value = el.typeId + '@' + el.withdrawType;
            label = el.message[getLanguageType()];
          } else {
            value = el.withdrawType;
            label = i18n[`task.details.withdraw.types.${el.withdrawType}`];
          }
          return {
            value,
            label
          };
        });
      if (this.withdrawType.indexOf('@') === -1) {
        let fields;
        switch (this.withdrawType) {
          case 'BANK_CARD':
            fields = FIELDS_BANK_CARD;
            for (let i in fields) {
              const item = enableWithdrawList
                .find(el => el.withdrawType === 'BANK_CARD')
                .fields.find(el => el.fieldId === i);
              fields[i].validateType = {
                required: item && item.required
              };
            }
            break;
          case 'DIGITAL_CASH':
            fields = FIELDS_DIGITAL_CASH;
            break;
          case 'CHECK':
            fields = FIELDS_CHECK;
            break;
          default:
            '';
        }
        for (let i in fields) {
          fieldsMap[i] = fields[i];
        }
        if (this.withdrawType === 'CHECK') {
          fieldsMap.bankName.optionList = bankList;
        }
        if (this.withdrawType === 'BANK_CARD') {
          fieldsMap.bankName.optionList = bankList;
          if (defaultValues.bankAccountName && !bankEditable) {
            BANK_INFO_FIELD_KEYS.forEach(key => {
              if (fieldsMap[key]) {
                fieldsMap[key]['readonly'] = true;
              }
            });
          } else {
            BANK_INFO_FIELD_KEYS.forEach(key => {
              if (fieldsMap[key]) {
                fieldsMap[key]['readonly'] = false;
              }
            });
            fieldsMap.bankAccountName.component = this.bankAccountNameGenerator();
            fieldsMap.bankAccountName.fieldType = BANK_ACCOUNT_NAME_KEY;
          }
        }
      }

      fieldsMap.withdrawType.onChange = this.withdrawTypeChange;
      if (enableWithdrawList.length == 1) {
        delete fieldsMap.withdrawType;
      }
      let withdrawObj = {};
      if (this.withdrawType) {
        withdrawObj = enableWithdrawList.find(
          way => way.customizTypeId === this.withdrawType.split('@').shift()
        );
      }
      this.max = withdrawObj.maxAmount;
      this.min = withdrawObj.minAmount;
      fieldsMap.withdrawAmount.component = this.withdrawAmountGenerator(
        fieldsMap.withdrawAmount.size,
        !!payCurrencyList.length,
        rebateAccount.currency,
        this.max,
        this.min
      );
      fieldsMap.withdrawAmount.fieldType = WITHDRAW_AMOUNT_KEY;
    }
    fieldsMap.comment = {
      label: i18n['withdraw.form.label.comment'],
      size: 100,
      fieldType: 'textarea'
    };
    let copyData = emulateFields(fieldsMap).concat();
    copyData.splice(copyData.length - 1, 0, ...customFormFields); //把自定义字段插入到备注之前。
    return copyData;
  };
  onSubmit = data => {
    return data;
  };
  onSubmitSuccess = data => {
    const { onSave, bankList } = this.props;
    const copyData = JSON.parse(JSON.stringify(data));
    const matchedBank = bankList.find(item => item.label === copyData.bankName);
    if (matchedBank) {
      copyData.bankId = matchedBank.id;
    }
    if (onSave) onSave(copyData);
  };
  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };
  formatDefaultValues = () => {
    //用于处理银行信息 给老数据生成bankId
    const { defaultValues, bankList } = this.props;
    if (!defaultValues.bankName) return defaultValues;
    else {
      const copyData = JSON.parse(JSON.stringify(defaultValues));
      const matchedBank = bankList.find(
        item =>
          item.label === defaultValues.bankName ||
          item.id === defaultValues.bankId
      );
      if (matchedBank) {
        copyData.bankId = matchedBank.id;
        copyData.bankName = matchedBank.label;
      } else {
        delete copyData.bankName;
        delete copyData.bankId;
      }
      return copyData;
    }
  };
  render() {
    const { configLoaded, exchangeRate } = this.state;
    const {
      rebateAccount: {
        accountId,
        accountName,
        currency,
        balance,
        serverId,
        vendor
      },
      withDrawConfig,
      defaultValues,
      maxWidthdraw
    } = this.props;
    const initialValues = {
      ...this.formData,
      accountId,
      accountName,
      currency: currency,
      payCurrency: _.get(exchangeRate, 'payCurrency', ''),
      withdrawType: this.withdrawType,
      accountBalance: balance,
      serverId,
      vendor,
      accountActualBalance: maxWidthdraw,
      ...this.formatDefaultValues()
    };
    if (this.withdrawType !== 'BANK_CARD') {
      delete initialValues.bankAccountName;
      delete initialValues.bankBranchName;
      delete initialValues.bankId;
      delete initialValues.bankName;
      delete initialValues.bankAddress;
      delete initialValues.bankAccountNumber;
      delete initialValues.swift;
    }
    let fields = this.formatFields();
    let reg = currency === 'BTC' ? NUMBER_REGEXP4 : NUMBER_REGEXP2;
    return (
      <ApplyForm
        max={this.max}
        min={this.min}
        reg={reg}
        onChange={this.onFormChange}
        disabled={!configLoaded}
        fields={fields}
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmitFail={this.onSubmitFail}
        {...this.props}
      />
    );
  }
}

function getWithDrawExchange(exchangeRate) {
  // exchage * (1 + float%);
  return (
    exchangeRate &&
    math.mul(
      exchangeRate.exchange,
      math.add(1, math.div(exchangeRate.exchangeFloat, 100))
    )
  );
}
