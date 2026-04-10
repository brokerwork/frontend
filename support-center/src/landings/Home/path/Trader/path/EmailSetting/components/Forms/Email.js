import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail, maxLength } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const EMAIL_FORM = 'BROKER_EMAIL_SETTING_EMAIL_FORM';

const maxLength200 = maxLength(200);


class EmailForm extends PureComponent {
  render() {
    const { emailProvider, securityType, onProviderChange, initialValues } = this.props;
    const disabled = initialValues.level === 'TENANT_PAY';

    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.provider']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="provider"
              label={i18n['email.setting.smtp.provider']}
              onFieldChange={onProviderChange}
              fieldType="select"
              component={FormField}
              options={emailProvider}
              validate={required}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.security']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="security"
              label={i18n['email.setting.smtp.security']}
              fieldType="select"
              component={FormField}
              options={securityType}
              validate={required}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.server']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="host"
              label={i18n['email.setting.smtp.server']}
              fieldType="text"
              component={FormField}
              validate={[required, maxLength200]}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.port']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="port"
              label={i18n['email.setting.smtp.port']}
              fieldType="number"
              component={FormField}
              validate={[required, maxLength200]}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.account']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="username"
              label={i18n['email.setting.smtp.account']}
              fieldType="text"
              component={FormField}
              validate={[required, maxLength200]}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.password']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="password"
              label={i18n['email.setting.smtp.password']}
              fieldType="password"
              component={FormField}
              validate={[required, maxLength200]}
              disabled={disabled}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.send.email']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="from"
              label={i18n['email.setting.smtp.send.email']}
              fieldType="text"
              component={FormField}
              validate={[required, isEmail, maxLength200]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.send.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="fromName"
              label={i18n['email.setting.smtp.send.name']}
              fieldType="text"
              component={FormField}
              validate={[required, maxLength200]}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: EMAIL_FORM,
  enableReinitialize: true
})(EmailForm);