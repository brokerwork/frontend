import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './Password.less';

export const CBROKER_PASSWORD_FORM = 'ACCOUNT_DETAIL_CBROKER_PASSWORD_FORM';

class PasswordForm extends PureComponent {
  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  render() {
    const { disabled, handleSubmit } = this.props;

    return (
      <Form horizontal onSubmit={handleSubmit(this.onSubmit)}>
        <Form.Item col="1">
          <Form.Label>{i18n['account.cbroker.label.password']}</Form.Label>
          <Form.Control>
            <Field
              name="password"
              className={cs['input']}
              component={renderField}
              columns={8}
              disabled={disabled}
              type="passwordField"
              label={i18n['account.cbroker.value.password']}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.reset_password.send_email_label']}
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
  form: CBROKER_PASSWORD_FORM,
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
})(PasswordForm);
