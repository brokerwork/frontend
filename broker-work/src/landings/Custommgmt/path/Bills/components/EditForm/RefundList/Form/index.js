import CustomField, { validate } from 'components/CustomField';
import {
  REFUND_FIELDS_MAP,
  REFUND_CURRENCY_LIST,
  ACTUAL_CURRENCY_LIST,
  HAS_MEDIATOR_LIST,
  FUND_TYPE_LIST,
  REFUND_TYPE_LIST
} from '../contants';
import emulateFields from 'utils/emulateFields';
import Form from 'components/Form';
import { Field, reduxForm } from 'redux-form';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from '../index.less';
import math from 'utils/math';
import { getApproveStageStr } from '../../../../../Customers/utils';

export const REFUND_INFO_FORM = 'REFUND_INFO_FORM';
const PlainText = ({ input }) => {
  return <span className={cs['plain-text-field']}>{input.value}</span>;
};
class MyForm extends PureComponent {
  constructor(props) {
    super(props);

    const {
      initialValues: { hasMediator }
    } = props;

    this.state = {
      inputKey: '',
      oldRefundFormValues: {},
      showMediator: hasMediator //是否显示居间人相关的数据
    };
  }

  updateOldRefundFormValues = () => {
    const { refundFormValues = {}, change } = this.props;
    setTimeout(() => {
      this.setState({
        oldRefundFormValues: refundFormValues
      });
    });
  };
  onFieldChange = (type, value) => {
    const { refundFormValues = {} } = this.props;
    const { oldRefundFormValues, showMediator } = this.state;
    let changeType = type;
    if (value === (oldRefundFormValues[type] || '')) {
      this.updateOldRefundFormValues();
      return; //onBlur 如果值没有变化 就忽略。
    }

    if (['actualAmount', 'exchangeRate'].includes(type)) {
      const { actualCurrency, refundCurrency } = refundFormValues;
      const { inputKey } = this.state;
      let newType = type;
      if (
        //汇率相同时的实收金额输入忽略
        type === 'actualAmount' &&
        actualCurrency === refundCurrency
      ) {
        newType = inputKey;
      } else if (
        //汇率不同时若实收金额为手填 不允许清空汇率
        type === 'exchangeRate' &&
        inputKey === 'actualAmount' &&
        !value &&
        actualCurrency !== refundCurrency
      ) {
        newType = inputKey;
        changeType = 'actualAmount'; //汇率不同时 清空汇率等同于根据actualAmount重新计算汇率
      }
      this.setState(
        {
          inputKey: newType
        },
        this.autoUpdateFormValues.bind(this, changeType)
      );
    } else {
      if (type === 'hasMediator' && showMediator !== value) {
        this.setState({ showMediator: value });
      }
      setTimeout(this.autoUpdateFormValues.bind(this, changeType)); //在reduxFormChange之后
    }
  };
  autoUpdateFormValues = type => {
    const { inputKey } = this.state;
    // actualAmount = refundAmount * exchangeRate
    const { refundFormValues = {}, change } = this.props;
    const {
      refundAmount,
      actualCurrency,
      actualAmount,
      refundCurrency,
      exchangeRate
    } = refundFormValues;

    const updateAcutalAmount = () => {
      const newActualAmount =
        refundAmount && exchangeRate
          ? getFixedNum(math.mul(refundAmount, exchangeRate))
          : '';
      change('actualAmount', newActualAmount || '');
    };

    const updateExchangeRate = () => {
      const newExchangeRate =
        refundAmount && actualAmount
          ? getFixedNum(math.div(actualAmount, refundAmount), 4)
          : '';
      change('exchangeRate', newExchangeRate || '');
    };
    if (type === 'actualCurrency') {
      if (actualCurrency !== refundCurrency) {
        updateAcutalAmount();
      } else {
        change('actualAmount', refundAmount || '');
        if (inputKey !== 'exchangeRate') {
          change('exchangeRate', '');
        }
      }
    } else if (actualCurrency === refundCurrency) {
      //同币种只更新实收金额
      change('actualAmount', refundAmount || '');
    } else if (type === 'refundAmount') {
      if (refundAmount && inputKey === 'actualAmount') {
        updateExchangeRate();
      } else {
        updateAcutalAmount();
      }
    } else if (type === 'exchangeRate') {
      //填写汇率或应收金额 改变 实收金额
      updateAcutalAmount();
    } else if (type === 'actualAmount') {
      //填写实收金额 改变 汇率
      updateExchangeRate();
    }

    this.updateProfit();
  };

  updateProfit = () => {
    setTimeout(() => {
      const { refundFormValues = {}, change } = this.props;
      const {
        refundAmount,
        exchangeRate,
        cost = 0,
        actualAmount,
        actualCurrency
      } = refundFormValues;
      const actualAmountRMB =
        actualCurrency === 'RMB'
          ? getFixedNum(actualAmount)
          : exchangeRate && refundAmount
            ? getFixedNum(math.mul(refundAmount, exchangeRate))
            : '';
      const profitValue = actualAmountRMB
        ? getFixedNum(math.sub(actualAmountRMB, cost))
        : '';
      change('actualAmountRMB', actualAmountRMB || '');
      change('profit', profitValue || '');
      this.updateOldRefundFormValues();
    });
  };
  componentDidMount() {
    this.updateProfit();
  }

  render() {
    const {
      initialValues: { refundStage }
    } = this.props;

    return (
      <Form>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.bill_no']}：
          </Form.Label>
          <Field
            name="billNo"
            component={renderField}
            disabled
            type="textField"
            columns={7}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.refund_no']}：
          </Form.Label>
          <Field
            name="refundNo"
            disabled
            component={renderField}
            type="textField"
            columns={7}
          />
          {refundStage && (
            <span className={cs['stage-' + refundStage]}>
              {getApproveStageStr(refundStage)}
            </span>
          )}
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.amount']}：
          </Form.Label>
          <Field
            name="refundCurrency"
            component={renderField}
            options={REFUND_CURRENCY_LIST}
            type="selectField"
            validate={required}
            className={cs['refund-form-control']}
            defaultSelect={false}
            columns={2}
            colClassName={cs['input-group-left']}
            onFieldChange={this.onFieldChange.bind(this, 'refundCurrency')}
          />
          <Field
            name="refundAmount"
            component={renderField}
            type="numberField"
            validate={required}
            colClassName={cs['input-group-right']}
            columns={3}
            onFieldBlur={this.onFieldChange.bind(this, 'refundAmount')}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.exchangeRate']}：
          </Form.Label>
          <span className={cs['prefix-text']}>1:</span>
          <Field
            name="exchangeRate"
            component={renderField}
            type="numberField"
            validate={required}
            decimal={'{0,4}'}
            className={cs['prefix-input']}
            columns={5}
            onFieldBlur={this.onFieldChange.bind(this, 'exchangeRate')}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.actual_amount']}：
          </Form.Label>
          <Field
            name="actualCurrency"
            component={renderField}
            options={ACTUAL_CURRENCY_LIST}
            type="selectField"
            validate={required}
            className={cs['refund-form-control']}
            defaultSelect={false}
            columns={2}
            colClassName={cs['input-group-left']}
            onFieldChange={this.onFieldChange.bind(this, 'actualCurrency')}
          />
          <Field
            name="actualAmount"
            component={renderField}
            type="numberField"
            validate={required}
            colClassName={cs['input-group-right']}
            columns={3}
            onFieldBlur={this.onFieldChange.bind(this, 'actualAmount')}
          />
          <span className={cs['field-note']}>
            <span className={cs['money-currency']}>{'RMB '}</span>
            <Field name="actualAmountRMB" component={PlainText} />
          </span>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>
            {i18n['customer.bill_field.hasMediator']}：
          </Form.Label>
          <Field
            name="hasMediator"
            component={renderField}
            type="radioField"
            radioList={HAS_MEDIATOR_LIST}
            // validate={required}
            onFieldChange={this.onFieldChange.bind(this, 'hasMediator')}
          />
        </Form.Item>
        {this.state.showMediator && (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['customer.bill_field.mediatorName']}：
            </Form.Label>
            <Field
              name="mediatorName"
              component={renderField}
              type="textField"
              columns={5}
              onFieldBlur={this.onFieldChange.bind(this, 'mediatorName')}
            />
          </Form.Item>
        )}
        {this.state.showMediator && (
          <Form.Item col={1}>
            <Form.Label>
              {i18n['customer.bill_field.mediatorRate']}：
            </Form.Label>
            <Field
              name="mediatorRate"
              component={renderField}
              type="numberField"
              columns={5}
              onFieldBlur={this.onFieldChange.bind(this, 'mediatorRate')}
            />
          </Form.Item>
        )}
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.cost']}：</Form.Label>
          <Field
            name="cost"
            component={renderField}
            type="numberField"
            columns={5}
            onFieldBlur={this.onFieldChange.bind(this, 'cost')}
          />
          <span className={cs['field-note']}>
            {i18n['customer.bill_field.profit']}:
            <span className={cs['money-currency']}>{'RMB'}</span>
            <Field name="profit" component={PlainText} />
          </span>
        </Form.Item>

        <Form.Item col={1}>
          <Form.Label required>{i18n['customer.bill_field.date']}：</Form.Label>
          <Field
            name="refundDate"
            component={renderField}
            type="dateField"
            validate={required}
            columns={9}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.fundType']}：</Form.Label>
          <Field
            name="fundType"
            component={renderField}
            options={FUND_TYPE_LIST}
            type="selectField"
            // validate={required}
            defaultSelect={false}
            className={cs['refund-form-control']}
            columns={5}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required>{i18n['customer.bill_field.type']}：</Form.Label>
          <Field
            name="refundType"
            component={renderField}
            options={REFUND_TYPE_LIST}
            type="selectField"
            validate={required}
            defaultSelect={false}
            className={cs['refund-form-control']}
            columns={5}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.pay_name']}：</Form.Label>
          <Field
            name="payName"
            component={renderField}
            type="textField"
            columns={9}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.pay_account']}：</Form.Label>
          <Field
            name="payAccount"
            component={renderField}
            type="textField"
            columns={9}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.pay_bank']}：</Form.Label>
          <Field
            name="payBank"
            component={renderField}
            type="textField"
            columns={9}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.comment']}：</Form.Label>
          <Field
            name="refundComment"
            component={renderField}
            type="textField"
            columns={9}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['customer.bill_field.certificates']}：</Form.Label>
          <Field
            name="certificates"
            component={renderField}
            type="uploadField"
            columns={9}
            fileExtensions={['jpg', 'png', 'jpeg']}
            uploadSizeLimit={20 * 1024 * 1024}
            uploadMultiple={true}
          />
        </Form.Item>
      </Form>
    );
  }
}

const BillForm = reduxForm({
  form: REFUND_INFO_FORM,
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
  }
})(MyForm);

export default class EditForm extends PureComponent {
  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => {
    return {
      ...data,
      refundDate: data.refundDate && data.refundDate.valueOf()
    };
  };

  onSubmitSuccess = data => {
    const { onSave } = this.props;
    const { refundType, hasMediator } = data;
    const newData = {
      ...data,
      refundType: i18n[`customer.bill_field.refundType.${refundType}`]
    };

    if (!hasMediator) {
      delete newData.mediatorName;
    }

    !!onSave && onSave(newData);
  };
  render() {
    const { fields = [], initialValues, refundFormValues } = this.props;
    const { refundType: refundTypeLabel } = initialValues;

    //收款类型服务器存的名称字符串
    let refundType;
    if (!!refundTypeLabel) {
      const refundTypeObj = REFUND_TYPE_LIST.find(
        item => item.label === refundTypeLabel
      );

      refundType = !!refundTypeObj ? refundTypeObj.value : 'other';
    }

    return (
      <BillForm
        onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={{ ...initialValues, refundType }}
        refundFormValues={refundFormValues}
      />
    );
  }
}

function getFixedNum(num, max = 2) {
  return (
    num &&
    `${num}`.replace(/^(\d+\.)(\d+)$/, (...args) => {
      return Number(args[0]).toFixed(
        args[2].length > max ? max : args[2].length
      );
    })
  );
}
