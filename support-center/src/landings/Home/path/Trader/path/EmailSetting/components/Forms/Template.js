import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const TEMPLATE_FORM = 'BROKER_EMAIL_SETTING_TEMPLATE_FORM';

class TemplateForm extends PureComponent {
  render() {
    const { emailList, viewNewTemp } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required" />
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
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['email.setting.template.subject']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="title"
              label={i18n['email.setting.template.subject']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['email.setting.template.content']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="content"
              label={i18n['email.setting.template.content']}
              fieldType="editor"
              component={FormField}
              validate={required}
            />
            <br />
            <br />
            <a href="javascript:void(0);" onClick={viewNewTemp}>
              <i className="fa fa-flag" />{' '}
              {i18n['email.setting.template.update_to_new']}
            </a>
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: TEMPLATE_FORM,
  enableReinitialize: true
})(TemplateForm);
