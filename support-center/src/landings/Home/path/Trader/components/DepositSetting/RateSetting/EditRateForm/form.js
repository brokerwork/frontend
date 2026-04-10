import Form from 'components/Form';
import { Field, getFormValues, reduxForm } from 'redux-form';
import { default as FormField } from 'components/FormField';
import { required, letters, free } from 'components/FormField/validate';
import i18n from 'utils/i18n';
import cs from './index.less';
import { EXCHANGE_SOURCE_LIST, exchangeModeType, exchangeSourceType } from '../../constant';
import { PAY_CURRENCY_LIST, TRANSACTION_CURRENCY_LIST } from '../rateConstants';
import Tips from 'components/Tips';
import { connect } from 'react-redux';
import { getRate } from '../../../../controls/actions';

export const EDIT_RATE_FORM = 'TRADER_PLAT_SETTING_EDIT_RATE_FORM';

/**
 * 货币有效性要验证
 * @param value
 * @return {*}
 */
function currencyValidate(value) {
  //字母&必填
  return required(value) || letters(value);
}

class CForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transactionCurrencyOps: TRANSACTION_CURRENCY_LIST, //交易货币选项,
      payCurrencyOps: PAY_CURRENCY_LIST //支付货币选项
    };
  }

  onModeChange = value => {
    const {
      formValues: { exchangeSource }
    } = this.props;
    if (value === exchangeSource) return;
    this.getCurrentRate(value);
  };
  getCurrentRate = value => {
    const {
      change,
      getRate,
      formValues: { transactionCurrency, payCurrency }
    } = this.props;
    if (!transactionCurrency || !payCurrency) {
      //未填写交易货币或支付货币
      change('exchange', null);
      return;
    }
    getRate(payCurrency, transactionCurrency, value).then(res => {
      if (res.result) {
        change('exchange', res.data);
      }
    });
  };
  onModeTypeChange = value => {
    const {
      change,
      formValues: { exchangeSource },
      editing
    } = this.props;
    if (editing) {
      //编辑模式下特殊处理
      this.getCurrentRate(exchangeSource);
      return;
    }

    if (value === 'Automatic') {
      //切换到自动模式，清空手动模式下输入的货币
      change('transactionCurrency', '');
      change('payCurrency', '');
    } else if (value === 'Manual') {
      change('exchangeFloat', 0);
    }
  };
  /**
   * 交易货币表单项
   * @return {*}
   */
  renderTCFormItem = () => {
    const {
      editing,
      formValues: { transactionCurrency, exchangeMode }
    } = this.props;

    const { transactionCurrencyOps } = this.state;

    let content;

    if (exchangeMode === 'Automatic') {
      //自动更新，选择框
      content = (
        <Field
          label={i18n['platform.tab.deposit.exchange.transaction.currency']}
          name="transactionCurrency"
          fieldType="searchSelect"
          component={FormField}
          options={transactionCurrencyOps}
          validate={currencyValidate}
          onSearchChange={this.onSearchTCChange}
          onFieldChange={this.onTCChange}
          disabled={editing}
        />
      );
    } else {
      //手动设置，输入框
      content = (
        <Field
          label={i18n['platform.tab.deposit.exchange.pay.currency']}
          name="transactionCurrency"
          fieldType="text"
          component={FormField}
          maxLength={10}
          validate={currencyValidate}
          onSearchChange={this.onSearchPCChange}
          disabled={editing}
        />
      );
    }

    return (
      <Form.Item>
        <Form.Label>{i18n['platform.tab.deposit.exchange.transaction.currency']}：</Form.Label>
        <Form.Control className={editing && cs.currency}>{content}</Form.Control>
      </Form.Item>
    );
  };
  /**
   * 支付货币表单项
   * @return {*}
   */
  renderPCFormItem = () => {
    const {
      editing,
      formValues: { payCurrency, transactionCurrency, exchangeMode }
    } = this.props;
    const { payCurrencyOps } = this.state;

    let content;

    if (exchangeMode === 'Automatic') {
      //自动更新，选择框
      content = (
        <Field
          label={i18n['platform.tab.deposit.exchange.pay.currency']}
          name="payCurrency"
          fieldType="searchSelect"
          component={FormField}
          options={payCurrencyOps}
          validate={currencyValidate}
          onSearchChange={this.onSearchPCChange}
          onFieldChange={this.onPCChange}
          disabled={editing}
        />
      );
    } else {
      //手动设置，输入框
      content = (
        <Field
          label={i18n['platform.tab.deposit.exchange.pay.currency']}
          name="payCurrency"
          fieldType="text"
          component={FormField}
          maxLength={10}
          validate={currencyValidate}
          onSearchChange={this.onSearchPCChange}
          disabled={editing}
        />
      );
    }

    return (
      <Form.Item>
        <Form.Label>{i18n['platform.tab.deposit.exchange.pay.currency']}：</Form.Label>
        <Form.Control className={editing && cs.currency}>{content}</Form.Control>
      </Form.Item>
    );
  };

  /**
   * 重置交易货币选项
   */
  resetTCOps = () => {
    //setTimeout避免浮层未消失数据就重置
    setTimeout(() => this.onSearchTCChange(''));
  };

  /**
   * 重置支付货币选项
   */
  resetPCOps = () => {
    //setTimeout避免浮层未消失数据就重置
    setTimeout(() => this.onSearchPCChange(''));
  };

  onTCChange = () => {
    const { change } = this.props;
    change('payCurrency', null);
    this.resetTCOps();

    //实时显示当前汇率
    const {
      formValues: { exchangeMode, exchangeSource }
    } = this.props;
    if (exchangeMode === 'Automatic') {
      //自动更新模式实时显示当前汇率
      setTimeout(() => this.getCurrentRate(exchangeSource));
    }
  };

  onPCChange = () => {
    this.resetPCOps();

    //实时显示当前汇率
    const {
      formValues: { exchangeMode, exchangeSource }
    } = this.props;
    if (exchangeMode === 'Automatic') {
      //自动更新模式实时显示当前汇率
      setTimeout(() => this.getCurrentRate(exchangeSource));
    }
  };

  /**
   * 不同的状况显示不同汇率来源组件
   * @param exchangeMode
   * @param payCurrency
   * @param transactionCurrency
   * @return {*}
   */
  renderSourceFormItem = (exchangeMode, payCurrency, transactionCurrency) => {
    if (exchangeMode !== 'Automatic') {
      return undefined;
    }

    if (payCurrency === 'CNY' && transactionCurrency === 'USD') {
      return (
        <Form.Item>
          <Form.Label>
            <label>
              {`${i18n['platform.tab.exchange.source.title']}：`}
              <Tips align="top">{i18n['platform.tab.deposit.exchange.source.tips']}</Tips>
            </label>
          </Form.Label>
          <Form.Control className={cs['rem-group']}>
            <Field
              label={i18n['platform.tab.exchange.source.title']}
              name="exchangeSource"
              fieldType="radio"
              component={FormField}
              options={exchangeSourceType}
              onFieldChange={this.onModeChange}
            />
          </Form.Control>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item>
          <Form.Label>{i18n['platform.tab.exchange.source.title']}：</Form.Label>
          <Form.Control className={cs['source-txt']}>
            <span>{i18n['platform.tab.deposit.exchange.source.union']}</span>
            {'  '}
            <span className={cs['source-tips']}>{`(${i18n['platform.tab.deposit.exchange.source.union.tips']})`}</span>
          </Form.Control>
        </Form.Item>
      );
    }
  };

  //交易货币选项搜索
  onSearchTCChange = v => {
    let result = TRANSACTION_CURRENCY_LIST;
    if (!!v) {
      result = result.filter(item => {
        if (!item.value) {
          return false;
        }

        return (
          item.value
            .toString()
            .toLowerCase()
            .indexOf(v.toString().toLowerCase()) > -1
        );
      });
    }

    this.setState({ transactionCurrencyOps: result });

    return Promise.resolve();
  };

  //支付货币选项搜索
  onSearchPCChange = v => {
    let result = PAY_CURRENCY_LIST;
    if (!!v) {
      result = result.filter(item => {
        if (!item.value) {
          return false;
        }

        return (
          item.value
            .toString()
            .toLowerCase()
            .indexOf(v.toString().toLowerCase()) > -1
        );
      });
    }

    this.setState({ payCurrencyOps: result });

    return Promise.resolve();
  };

  //支付货币可选项
  getPCOps = transactionCurrency => {
    const { payCurrencyOps } = this.state;

    const tcObj = TRANSACTION_CURRENCY_LIST.find(item => item.value === transactionCurrency);
    const reciprocal = !!tcObj && tcObj.reciprocal;

    //有部分支付货币是在指定交易货币下才能选择
    if (!!reciprocal) {
      return payCurrencyOps;
    }

    return payCurrencyOps.filter(item => !item.reciprocal);
  };

  render() {
    if (!this.props.formValues) return null;
    const {
      formValues: { transactionCurrency, payCurrency, exchangeMode },
      editing
    } = this.props;

    return (
      <Form showHelpText>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.exchange.type.name']}：</Form.Label>
          <Form.Control className={cs['rem-group']}>
            <Field
              label={i18n['platform.tab.deposit.exchange.type.name']}
              name="exchangeMode"
              fieldType="radio"
              component={FormField}
              options={exchangeModeType}
              onFieldChange={this.onModeTypeChange}
              // disabled={editing && (payCurrency !== 'CNY' || transactionCurrency !== 'USD')}
            />
          </Form.Control>
        </Form.Item>
        {this.renderSourceFormItem(exchangeMode, payCurrency, transactionCurrency)}
        {this.renderTCFormItem()}
        {this.renderPCFormItem()}
        <Form.Item>
          <Form.Label>
            {exchangeMode !== 'Automatic' ? <span className="required" /> : null}
            {i18n['platform.tab.deposit.exchange.current.rate']}：
          </Form.Label>
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.exchange.current.rate']}
              name="exchange"
              fieldType="number"
              decimal="{0,8}"
              component={FormField}
              validate={exchangeMode !== 'Automatic' ? required : free}
              disabled={exchangeMode === 'Automatic'}
            />
          </Form.Control>
        </Form.Item>
        {exchangeMode === 'Automatic' && (
          <Form.Item>
            <Form.Label>{i18n['platform.tab.deposit.exhcange.up']}：</Form.Label>
            <Form.Control>
              <Field
                label={i18n['platform.tab.deposit.exhcange.up']}
                name="exchangeFloat"
                fieldType="number"
                negative={true}
                component={FormField}
                // disabled={exchangeMode === 'Manual'}
              />
            </Form.Control>
            <Form.HelpText>%</Form.HelpText>
          </Form.Item>
        )}
        <Form.Item>
          <Form.Label />
          <Form.Control>
            <Field
              label={i18n['platform.tab.deposit.show.exchange']}
              name="showExchange"
              fieldType="checkbox"
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

const EditRateForm = reduxForm({
  form: EDIT_RATE_FORM,
  enableReinitialize: true,
  validate: (values, props) => {
    const errors = {};

    if (values.exchangeMode === 'Automatic') {
      if (!TRANSACTION_CURRENCY_LIST.find(item => item.value === values.transactionCurrency)) {
        errors.transactionCurrency = i18n['platform.tab.deposit.exchange.invalidateCurrency'];
      }

      if (!PAY_CURRENCY_LIST.find(item => item.value === values.payCurrency)) {
        errors.payCurrency = i18n['platform.tab.deposit.exchange.invalidateCurrency'];
      }
    }

    return errors;
  }
})(CForm);

export default connect(
  state => {
    return {
      formValues: getFormValues(EDIT_RATE_FORM)(state)
    };
  },
  { getRate }
)(EditRateForm);
