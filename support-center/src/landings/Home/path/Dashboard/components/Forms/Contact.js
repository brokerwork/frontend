import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail, isPhone } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { CONTACT_TYPE } from '../../constant';

export const CONTACT_FORM = 'DASHBOARD_CONTACT_FORM';


const validatePhone = value =>
  value && (value.length < 5 || value.length > 20)
    ? i18n['validate.phone']
    : undefined;

class ContactForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashboard.contacts.type']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="contactsType" 
              label={i18n['dashboard.contacts.type']}
              fieldType="select"
              options={CONTACT_TYPE}
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashboard.contacts.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="contactsName" 
              label={i18n['dashboard.contacts.name']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashboard.contacts.email']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="email" 
              label={i18n['dashboard.contacts.email']}
              fieldType="text"
              component={FormField}
              validate={[required, isEmail]}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            {i18n['dashboard.contacts.phone']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="phone" 
              label={i18n['dashboard.contacts.phone']}
              fieldType="text"
              component={FormField}
              validate={validatePhone}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: CONTACT_FORM
})(ContactForm);