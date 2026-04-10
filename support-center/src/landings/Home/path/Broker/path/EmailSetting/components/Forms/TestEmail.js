import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const TEST_EMAIL_FORM = 'BROKER_EMAIL_SETTING_TEST_EMAIL_FORM';


class TestEmailForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.test.email.send']}：
          </Form.Label>
          <Form.Control>
            <Field 
              name="to"
              label={i18n['email.setting.test.email.send']}
              fieldType="text"
              component={FormField}
              validate={[required, isEmail]}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: TEST_EMAIL_FORM
})(TestEmailForm);