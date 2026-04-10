import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import language from 'utils/language';
import cs from './EmailSettingForm.less';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
export const EMAIL_SETTING_FORM = 'USER_SETTING_EMAIL_SETTING_FORM';
const languageType = language.getType();
class EmailSettingForm extends PureComponent {
  render() {
    const { handleSubmit, reset } = this.props;
    const autoSize = languageType === 'en-US' ? 2 : 1;
    return (
      <form onSubmit={handleSubmit} style={{ width: 400 }}>
        <Form>
          <FormItem col={autoSize}>
            <FormLabel className={cs['label']}>
              {i18n['user_setting.email_setting.origin_email_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="origin"
                component={renderField}
                columns={2}
                className={cs['input']}
                type="textField"
                disabled
              />
            </FormControl>
          </FormItem>
          <FormItem col={autoSize}>
            <FormLabel className={cs['label']}>
              <span className="required" />
              {i18n['user_setting.email_setting.new_email_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="newEmail"
                component={renderField}
                columns={2}
                className={cs['input']}
                type="textField"
                label={i18n['user_setting.email_setting.new_email']}
                validate={required}
              />
            </FormControl>
          </FormItem>
          <FormItem col={autoSize}>
            <Button type="primary" htmlType="submit" className={cs['btn']}>
              {i18n['general.save']}
            </Button>
            <Button onClick={reset} className={cs['btn']}>
              {i18n['general.cancel']}
            </Button>
          </FormItem>
        </Form>
      </form>
    );
  }
}

export default reduxForm({
  form: EMAIL_SETTING_FORM,
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
})(EmailSettingForm);
