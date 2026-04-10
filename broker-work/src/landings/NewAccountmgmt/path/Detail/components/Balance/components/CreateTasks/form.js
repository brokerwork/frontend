import { Field } from 'redux-form';
import { Form, Input, Button } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from '../../Balance.less';
import CustomField from 'components/v2/CustomField';
import { notHideBox, isShowFieldsByWithdraw } from '../../constant';
import { required } from 'utils/v2/renderField';
import _ from 'lodash';

export default class CreateTasks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      finalExchange: props.finalExchange,
      payAmount: props.payAmount,
      showExchange: props.defaultExchangeRateSetting.showExchange,
      fieldItem: props.fieldItem,
      notice: props.notice
    };
  }
  componentDidMount() {
    const { formValues } = this.props;
    const { fieldItem } = this.state;
    let copyFieldItem = _.cloneDeep(fieldItem);
    // 汇率;
    // 添加计算汇率函数;
    this.getFieldValue(
      copyFieldItem,
      'withdrawAmount'
    ).onChange = this.computeExchange;
    // 添加银行账号选择方法
    this.getFieldValue(
      copyFieldItem,
      'bankAccount'
    ).onChange = this.handleBankAccount;
    this.getFieldValue(
      copyFieldItem,
      'withdrawType'
    ).onChange = this.handleWithdrawType;
    this.getFieldValue(
      copyFieldItem,
      'withdrawCurrency'
    ).onChange = this.handleWithdrawCurrency;
    this.setState({
      fieldItem: copyFieldItem
    });
  }
  // 添加银行
  addBank = () => {};
  // 获取item对应field的项
  getFieldValue = (items, name) => {
    return items && items.length && items.find(item => item.key === name);
  };
  // 根据选择出金方式 某些字段不显示
  showFieldsByWithdraw = (value, items) => {
    // this.withdrawType = value;
    items
      .filter(item => !notHideBox.includes(item.key))
      .forEach(i => (i.hide = false));
    isShowFieldsByWithdraw[value] &&
      isShowFieldsByWithdraw[value].forEach(
        v => (this.getFieldValue(items, v).hide = true)
      );
  };
  //汇率计算
  computeExchange = e => {
    const { fieldItem, defaultExchangeRateSetting, formValues } = this.props;

    let payAmount;

    let {
      showExchange,
      exchangeMode,
      exchange,
      exchangeFloat
    } = defaultExchangeRateSetting;

    payAmount = (e.target.value * this.state.finalExchange).toFixed(
      formValues.currency === 'BTC' ? 4 : 2
    );
    this.setState({
      payAmount
    });
  };
  // 选择银行账号，修改默认信息
  handleBankAccount = value => {
    const { bindBank, change } = this.props;
    let defaultInfo = bindBank.find(el => {
      return el.bankAccountNumber == value;
    });
    if (!defaultInfo) return;
    change('bankAccount', defaultInfo.bankAccountNumber);
    change('bankAccountName', defaultInfo.bankAccountName);
    change('bank', defaultInfo.bankName);
    change('bankBranchName', defaultInfo.bankBranchName);
    change('SWIFT', defaultInfo.SWIFT);
    change('bankAddress', defaultInfo.bankAddress);
  };
  // 修改出金类型
  handleWithdrawType = value => {
    const { vendor, osConfig, getFormFields } = this.props;
    const { fieldItem } = this.state;
    let copyFieldItem = _.cloneDeep(fieldItem);
    this.showFieldsByWithdraw(value, copyFieldItem);
    // 设置字段是否必填
    const configData =
      osConfig &&
      osConfig.length &&
      osConfig.find(item => item.structural === vendor);
    const withdrawSetting = _.get(configData, 'withdrawSetting', {});
    const ways = _.get(withdrawSetting, 'ways', []);
    const waysItem = ways.find(item => item.withdrawType === value) || {};
    const fields = waysItem.fields || [];
    fields.forEach(item => {
      if (this.getFieldValue(copyFieldItem, item.fieldId)) {
        this.getFieldValue(copyFieldItem, item.fieldId).required =
          item.required;
      }
    });
    const notice = waysItem.notice || '';
    // 重新获取自定义字段
    getFormFields(vendor, value);
    this.setState({
      fieldItem: copyFieldItem,
      notice
    });
  };
  // 修改出金货币重新计算汇率
  handleWithdrawCurrency = value => {
    const { exchangeRateSettings, formValues, changeExhange } = this.props;
    let payAmount;
    let finalExchange;
    let { exchange, exchangeFloat, showExchange } = exchangeRateSettings.find(
      el => {
        return (
          el.payCurrency === value &&
          formValues.currency === el.transactionCurrency
        );
      }
    );
    finalExchange = exchange * (1 + exchangeFloat / 100);
    let withdrawNum = formValues.withdrawAmount || 0;
    payAmount = (withdrawNum * finalExchange).toFixed(
      formValues.currency === 'BTC' ? 4 : 2
    );
    changeExhange(finalExchange);
    this.setState({
      payAmount,
      finalExchange,
      showExchange
    });
  };
  // 渲染固定field
  renderFieldItem = () => {
    const { formValues, payCurrencyList } = this.props;
    const { payAmount, finalExchange, showExchange, fieldItem } = this.state;
    return fieldItem.filter(item => !item.hide).map(field => {
      const label = field.label
        ? field.label
        : i18n[`settings.deposit_withdraw.create_task.${field.key}`];
      let validate = null;
      if (field.required) {
        if (!field.validateType) {
          field.validateType = [];
        }
        if (!field.validateType.includes(required)) {
          field.validateType.push(required);
        }
        validate = field.validateType;
      } else {
        if (field.validateType) {
          _.remove(field.validateType, function(n) {
            return n === required;
          });
          validate = field.validateType;
        }
      }
      return (
        <Form.Item required={field.required} col="1">
          <Form.Label>{label}</Form.Label>
          <Form.Control>
            <Field
              name={field.key}
              component={renderField}
              type={field.fieldType}
              validate={validate}
              label={label}
              disabled={field.disabled}
              options={field.list && field.list.length && field.list}
              onFieldChange={field.onChange}
              searchable={field.searchable}
              edit={field.edit}
              placeholder={field.placeholder}
            />
            {field.key === 'withdrawAmount' &&
              showExchange &&
              !!payCurrencyList.length && (
                <div className={cs.rate}>
                  {formValues.withdrawCurrency}：{payAmount}（
                  {i18n['settings.deposit_withdraw.create_task.exchange']}：
                  {finalExchange.toFixed(4)}）
                </div>
              )}
          </Form.Control>
        </Form.Item>
      );
    });
  };
  render() {
    const { formFields, showInfo, formValues } = this.props;
    if (!formValues) {
      return null;
    }
    return (
      <div
        className={cs.widthdraw_container}
        style={{ display: showInfo ? 'none' : 'block' }}
      >
        <Form horizontal>
          {this.renderFieldItem()}
          <div className={cs.customFieldForm}>
            <CustomField fields={formFields} />
          </div>
          {/* 公告 */}
          <Form.Item col="1">
            <Form.Label />

            <div className={cs['gold-notice']}>
              <div className={cs['header']}>
                {i18n['settings.deposit_withdraw.create_task.notice']}
              </div>
              <div className={cs['body']}>{this.state.notice}</div>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
