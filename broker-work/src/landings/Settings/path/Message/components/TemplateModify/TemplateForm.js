import { FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';

import { Form } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import { isRequired } from 'utils/validate';
import i18n from 'utils/i18n';
import cs from './add.less';
import { MESSAGE_TYPE_SMS, MESSAGE_TYPE_WEB_ALERT } from '../../../../constant';
export const TEMPLATE_FORM = 'TEMPLATE_FORM';

const validate = (values, props) => {
  let errors = {};
  ['type', 'title', 'name', 'content'].forEach(key => {
    if (!isRequired(values[key])) {
      errors[key] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n[`settings.message_template.${key}`] }}
        />
      );
    }
  });
  return errors;
};

class TemplateForm extends Component {
  state = {
    nameLen:
      this.props.initialValues && this.props.initialValues.name
        ? this.props.initialValues.name.length
        : 0,
    titleLen:
      this.props.initialValues && this.props.initialValues.title
        ? this.props.initialValues.title.length
        : 0
  };

  onFieldChange = (key, value) => {
    this.setState({ [`${key}Len`]: value.target.value.length });
  };

  render() {
    const { messageType, currentFormInfo, type } = this.props;
    const { nameLen, titleLen } = this.state;
    return (
      <Form className={cs.form}>
        {/* <Form.Item col={1} required>
          <Form.Label> {i18n['settings.message_template.type']} </Form.Label>
          <Field
            name="type"
            options={messageType}
            component={renderField}
            type="selectField"
            placeholder={i18n['general.default.select']}
            disabled={type === 'edit'}
          />
        </Form.Item> */}
        <Form.Item col={1} required>
          <Form.Label> {i18n['settings.message_template.title']} </Form.Label>
          <Field
            name="title"
            component={renderField}
            type="textField"
            maxLength={50}
            onFieldChange={this.onFieldChange.bind(this, 'title')}
            suffix={<span>{`${titleLen}/50`}</span>}
            placeholder={i18n['settings.message_template.inputSubject']}
          />
        </Form.Item>
        {currentFormInfo &&
          currentFormInfo.type !== MESSAGE_TYPE_SMS && (
            <Form.Item col={1} required>
              <Form.Label>
                {' '}
                {i18n['settings.message_template.name']}{' '}
              </Form.Label>
              <Field
                name="name"
                component={renderField}
                type="textField"
                maxLength={50}
                onFieldChange={this.onFieldChange.bind(this, 'name')}
                suffix={<span>{`${nameLen}/50`}</span>}
                placeholder={i18n['settings.message_template.inputSender']}
              />
            </Form.Item>
          )}
        <Form.Item col={1} required>
          <Form.Label> {i18n['settings.message_template.content']} </Form.Label>
          {currentFormInfo && currentFormInfo.type === MESSAGE_TYPE_SMS ? (
            <Field
              name="content"
              component={renderField}
              type="textareaField"
              maxLength={300}
              rows={8}
              columns={10}
              placeholder={i18n['settings.message_template.sms_content_holder']}
            />
          ) : null}
          {currentFormInfo &&
          currentFormInfo.type === MESSAGE_TYPE_WEB_ALERT ? (
            <Field
              name="content"
              component={renderField}
              type="textareaField"
              rows={8}
              columns={10}
            />
          ) : null}
          {currentFormInfo &&
          currentFormInfo.type !== MESSAGE_TYPE_SMS &&
          currentFormInfo.type !== MESSAGE_TYPE_WEB_ALERT ? (
            <Field
              name="content"
              component={renderField}
              type="richField"
              columns={10}
            />
          ) : null}
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: TEMPLATE_FORM,
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
  validate
})(TemplateForm);
