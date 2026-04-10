import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const TEMPLATE_EMAIL_FORM = 'BROKER_EMAIL_SETTING_TEMPLATE_EMAIL_FORM';


class TemplateEmailForm extends PureComponent {
  render() {
    const { emailList } = this.props;

    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['email.setting.smtp.send.email']}：
          </Form.Label>
          <Form.Control>
            <Field 
              name="configId"
              label={i18n['email.setting.smtp.send.email']}
              fieldType="select"
              options={emailList}
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
  form: TEMPLATE_EMAIL_FORM
})(TemplateEmailForm);