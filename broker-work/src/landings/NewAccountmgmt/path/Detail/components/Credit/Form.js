import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required, number } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './Credit.less';

export const CREDIT_FORM = 'ACCOUNT_DETAIL_CREDIT_FORM';

const amountVaild = (value, allValues) => {
  const isError =
    parseFloat(value) > parseFloat(allValues.credit) &&
    allValues.type === 'out';

  return isError ? i18n['account.edit_account_credit.amount_vaild'] : undefined;
};

class CreditForm extends PureComponent {
  render() {
    const { disabled, currentType, onTypeChange } = this.props;
    const typeList = [
      { label: i18n['account.edit_account_credit.in'], value: 'in' },
      { label: i18n['account.edit_account_credit.out'], value: 'out' }
    ];

    return (
      <Form horizontal>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.edit_account_credit.type_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="type"
              component={renderField}
              disabled={disabled}
              type="radioField"
              radioList={typeList}
              onFieldChange={onTypeChange}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="1">
          <Form.Label>
            {i18n['account.edit_account_credit.expiration_time_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="expirationTime"
              component={renderField}
              disabled={disabled}
              type="dateField"
              label={i18n['account.edit_account_credit.expiration_time']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="1">
          <Form.Label>
            {i18n['account.edit_account_credit.credit_amount_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="creditAmount"
              component={renderField}
              disabled={disabled}
              type="numberField"
              maxLength="15"
              label={i18n['account.edit_account_credit.credit_amount']}
              precision={2}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.edit_account_credit.comment_label']}
          </Form.Label>
          <Form.Control>
            {currentType === 'in' ? (
              <Field
                name="inComment"
                component={renderField}
                disabled={disabled}
                type="textareaField"
                maxLength="30"
                columns={10}
                label={i18n['account.edit_account_credit.comment']}
              />
            ) : (
              <Field
                name="outComment"
                component={renderField}
                disabled={disabled}
                type="textareaField"
                maxLength="30"
                columns={10}
                label={i18n['account.edit_account_credit.comment']}
              />
            )}
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.edit_account_credit.send_email_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="sendEmail"
              component={renderField}
              disabled={disabled}
              type="switchField"
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: CREDIT_FORM,
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
    const { onSave } = props;

    const errors = {};

    if (required(values.creditAmount)) {
      errors.creditAmount = required(values.creditAmount);
    } else if (number(values.creditAmount)) {
      errors.creditAmount = number(values.creditAmount);
    } else if (amountVaild(values.creditAmount, values)) {
      errors.creditAmount = amountVaild(values.creditAmount, values);
    }

    if (required(values.expirationTime)) {
      errors.expirationTime = required(values.expirationTime);
    }

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);

      return values;
    }

    onSave(values);
  }
})(CreditForm);
