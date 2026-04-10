import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import cs from './Password.less';

export const PASSWORD_FORM = 'ACCOUNT_DETAIL_PASSWORD_FORM';

const validateValues = ['password', 'investorPassword'];

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
          <Form.Label>
            {i18n['account.reset_password.password_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="password"
              className={cs['input']}
              component={renderField}
              columns={8}
              disabled={disabled}
              type="passwordField"
              label={i18n['account.reset_password.password']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.reset_password.investor_password_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="investorPassword"
              className={cs['input']}
              component={renderField}
              columns={8}
              disabled={disabled}
              type="passwordField"
              label={i18n['account.reset_password.investor_password']}
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
  form: PASSWORD_FORM,
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
  validate: function(values = {}, props) {
    const { vendor, passwordRegular } = props;
    const errors = {};

    if (validateValues.every(item => required(values[item]))) {
      validateValues.forEach(item => {
        errors[item] = required(values[item]);
      });

      return errors;
    }

    // mt5服务器组时 主密码, 投资密码格式验证
    if (vendor === 'MT5') {
      const { reg, minLength } = passwordRegular || {};
      validateValues.forEach(item => {
        if (required(values[item])) {
          return (errors[item] = '');
        }
        if (values[item].match(reg)) return;
        errors[item] = (
          <FormattedMessage
            id="custom_field.min_number"
            defaultMessage={i18n['custom_field.min_number']}
            values={{ value: minLength }}
          />
        );
      });
    } else {
      // mt4服务器组时 主密码, 投资密码格式验证
      validateValues.forEach(item => {
        if (required(values[item])) return (errors[item] = '');
        if (eval(passwordRegular).test(values[item])) return;

        errors[item] = (
          <FormattedMessage
            id="custom_field.regular"
            defaultMessage={i18n['custom_field.regular']}
            values={{
              value:
                item === 'password'
                  ? i18n['account.reset_password.password']
                  : i18n['account.reset_password.investor_password']
            }}
          />
        );
      });
    }

    return errors;
  }
})(PasswordForm);
