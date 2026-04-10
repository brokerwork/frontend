import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './Leverage.less';

export const LEVERAGE_FORM = 'ACCOUNT_DETAIL_LEVERAGE_FORM';

const isLessThanMaxLeverage = (value, allValues) => {
  return parseFloat(value) > parseFloat(allValues['maxLeverage'])
    ? i18n['account.cbroker.leverage.max_error_tips']
    : undefined;
};

class LeverageForm extends PureComponent {
  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  render() {
    const {
      disabled,
      resources: { leverage, maxLeverage },
      handleSubmit
    } = this.props;

    return (
      <Form horizontal onSubmit={handleSubmit(this.onSubmit)}>
        <Form.Item required col="1">
          <Form.Label>
            {i18n['account.modify_leverage.label.modify_leverage']}
          </Form.Label>
          <Form.Control>
            <Field
              name="leverage"
              component={renderField}
              className={cs['select']}
              columns={8}
              disabled={disabled}
              type="selectField"
              options={leverage}
              validate={[required, isLessThanMaxLeverage]}
              label={i18n['account.modify_leverage.value.modify_leverage']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="1">
          <Form.Label>{i18n['account.cbroker.label.max_leverage']}</Form.Label>
          <Form.Control>
            <Field
              name="maxLeverage"
              component={renderField}
              className={cs['select']}
              columns={8}
              disabled={disabled}
              type="selectField"
              options={maxLeverage}
              validate={required}
              label={i18n['account.cbroker.value.max_leverage']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.modify_leverage.label.send_email']}
          </Form.Label>
          <Form.Control>
            <Field
              name="sendEmail"
              component={renderField}
              columns={8}
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
  form: LEVERAGE_FORM,
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
  enableReinitialize: true
})(LeverageForm);
