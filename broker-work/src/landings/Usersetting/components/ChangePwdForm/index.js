import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import language from 'utils/language';
import cs from './ChangePwdForm.less';
import { toJsRegExpMap } from 'utils/validate';

const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;
export const CHANGE_PWD_FORM = 'USER_SETTING_CHANGE_PWD_FORM';
const same = (value, allValues) => {
  return value !== allValues['newPwd']
    ? i18n['user_setting.change_pwd.pwd_not_same']
    : undefined;
};

const languageType = language.getType();

class ChangePwdForm extends PureComponent {
  errorText = {
    Middle: i18n['general.password.middle.invalid.bw'],
    Strong: i18n['general.password.strong.invalid.bw'],
    SuperStrong: i18n['general.password.superstrong.invalid.bw']
  };
  render() {
    let backReg = this.props.password_strength.pwdRegexMap;
    let strengh = this.props.password_strength.pwdStrength;
    let regMap = toJsRegExpMap(backReg);
    let reg = regMap[strengh];
    const pwdReg = value => {
      return !reg.test(value) ? i18n['custom_field.password'] : undefined;
    };

    const { handleSubmit, reset } = this.props;
    const autoSize = languageType === 'en-US' ? 1 : 1;
    return (
      <form onSubmit={handleSubmit} style={{ width: 400 }}>
        <Form>
          <FormItem col={autoSize}>
            <FormLabel className={cs['label']}>
              <span className="required" />
              {i18n['user_setting.change_pwd.origin_pwd_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="origin"
                placeholder={
                  i18n['user_setting.change_pwd.origin_pwd_placeholder']
                }
                component={renderField}
                columns={2}
                className={cs['input']}
                type="passwordField"
                label={i18n['user_setting.change_pwd.origin_pwd']}
                validate={required}
              />
            </FormControl>
          </FormItem>
          <FormItem col={autoSize}>
            <FormLabel className={cs['label']}>
              <span className="required" />
              {i18n['user_setting.change_pwd.new_pwd_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="newPwd"
                placeholder={this.errorText[strengh]}
                component={renderField}
                columns={2}
                className={cs['input']}
                type="passwordField"
                label={i18n['user_setting.change_pwd.new_pwd']}
                validate={[required, pwdReg]}
              />
            </FormControl>
          </FormItem>
          <FormItem col={autoSize}>
            <FormLabel className={cs['label']}>
              <span className="required" />
              {i18n['user_setting.change_pwd.confirm_pwd_label']}
            </FormLabel>
            <FormControl>
              <Field
                name="verified"
                placeholder={
                  i18n['user_setting.change_pwd.confirm_pwd_placeholder']
                }
                component={renderField}
                columns={2}
                className={cs['input']}
                type="passwordField"
                label={i18n['user_setting.change_pwd.confirm_pwd']}
                validate={[required, same]}
              />
            </FormControl>
          </FormItem>
          <FormItem col={1}>
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
  form: CHANGE_PWD_FORM,
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
})(ChangePwdForm);
