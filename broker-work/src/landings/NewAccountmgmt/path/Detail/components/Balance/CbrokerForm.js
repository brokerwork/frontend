import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { required, renderField, maxLength } from 'utils/v2/renderField';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import cs from './Balance.less';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
export const CBROKER_BALANCE_FORM = 'ACCOUNT_DETAIL_CBROKER_BALANCE_FORM';

class BalanceForm extends PureComponent {
  onSubmit = values => {
    const { onSave, getAccountDetail } = this.props;
    const errors = {};

    if (required(values.amount)) {
      errors.amount = required(values.amount)(
        i18n['account.edit_account_money.amount']
      );
    }

    if (maxLength(40)(values.innerComment)) {
      errors.innerComment = maxLength(40)(values.innerComment);
    }

    if (maxLength(40)(values.remark)) {
      errors.remark = maxLength(40)(values.remark);
    }

    if (values.amount && values.type === 'withdraw') {
      return getAccountDetail().then(({ result, data }) => {
        if (result) {
          const amount = parseFloat(values.amount);
          const { balance } = data.accountInfo;
          const item = [];

          if (amount > parseFloat(balance))
            item.push(i18n['account.account_detail.balance']);

          const errorMsg = (
            <FormattedMessage
              id="account.account_detail.withdraw.tips"
              defaultMessage={i18n['account.account_detail.withdraw.tips']}
              values={{ items: item.join(i18n['general.stop']) }}
            />
          );

          if (item.length) {
            errors.amount = errorMsg;
          }

          if (Object.keys(errors).length) {
            throw new SubmissionError(errors);
          } else {
            onSave(values);
          }
        }
      });
    }

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);

      return values;
    }

    onSave(values);
  };

  render() {
    const { disabled, handleSubmit, onTypeChange } = this.props;
    const typeList = [
      { label: i18n['account.edit_account_money.deposit'], value: 'deposit' },
      { label: i18n['account.edit_account_money.withdraw'], value: 'withdraw' }
    ];

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <FormItem required col="1">
          <FormLabel>{i18n['account.edit_account_money.type_label']}</FormLabel>
          <FormControl>
            <Field
              name="type"
              onFieldChange={onTypeChange}
              component={renderField}
              disabled={disabled}
              type="radioField"
              radioList={typeList}
            />
          </FormControl>
        </FormItem>
        <FormItem required col="1">
          <FormLabel>
            {i18n['account.edit_account_money.amount_label']}
          </FormLabel>
          <FormControl>
            <Field
              name="amount"
              component={renderField}
              disabled={disabled}
              type="numberField"
              maxLength="15"
              label={i18n['account.edit_account_money.amount']}
              validate={required}
            />
          </FormControl>
        </FormItem>
        <FormItem col="1">
          <FormLabel>{i18n['account.cbroker.label.inner_comment']}</FormLabel>
          <FormControl>
            <Field
              name="innerComment"
              component={renderField}
              disabled={disabled}
              type="maxLengthTextareaField"
              maxLength="40"
              columns={10}
            />
          </FormControl>
        </FormItem>
        <FormItem col="1">
          <FormLabel>{i18n['account.cbroker.label.comment']}</FormLabel>
          <FormControl>
            <Field
              name="remark"
              component={renderField}
              disabled={disabled}
              type="maxLengthTextareaField"
              maxLength="40"
              columns={10}
            />
          </FormControl>
        </FormItem>
        <FormItem col="1">
          <FormLabel>
            {i18n['account.edit_account_money.send_email_label']}
          </FormLabel>
          <FormControl>
            <Field
              name="sendEmail"
              component={renderField}
              disabled={disabled}
              type="switchField"
            />
          </FormControl>
        </FormItem>
      </Form>
    );
  }
}

export default reduxForm({
  form: CBROKER_BALANCE_FORM,
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
  onSubmit: (values, dispatch, props) => {
    const { onSave, getAccountDetail } = props;
    const errors = {};

    if (required(values.amount)) {
      errors.amount = required(values.amount)(
        i18n['account.edit_account_money.amount']
      );
    }

    if (maxLength(40)(values.innerComment)) {
      errors.innerComment = maxLength(40)(values.innerComment);
    }

    if (maxLength(40)(values.remark)) {
      errors.remark = maxLength(40)(values.remark);
    }

    if (values.amount && values.type === 'withdraw') {
      return getAccountDetail().then(({ result, data }) => {
        if (result) {
          const amount = parseFloat(values.amount);
          const { balance } = data.accountInfo;
          const item = [];

          if (amount > parseFloat(balance))
            item.push(i18n['account.account_detail.balance']);

          const errorMsg = (
            <FormattedMessage
              id="account.account_detail.withdraw.tips"
              defaultMessage={i18n['account.account_detail.withdraw.tips']}
              values={{ items: item.join(i18n['general.stop']) }}
            />
          );

          if (item.length) {
            errors.amount = errorMsg;
          }

          if (Object.keys(errors).length) {
            throw new SubmissionError(errors);
          } else {
            onSave(values);
          }
        }
      });
    }

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);

      return values;
    }

    onSave(values);
  }
})(BalanceForm);
