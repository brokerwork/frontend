import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const ENABLE_EMAIL_SERVICE_FORM = 'DASHBOARD_ENABLE_EMAIL_SERVICE_FORM';

class EnableEmailServiceForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashboard.vas.introduction.email.email']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="email" 
              label={i18n['dashboard.vas.introduction.email.email']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashboard.vas.introduction.email.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="sender" 
              label={i18n['dashboard.vas.introduction.email.name']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: ENABLE_EMAIL_SERVICE_FORM,
  enableReinitialize: true
})(EnableEmailServiceForm);