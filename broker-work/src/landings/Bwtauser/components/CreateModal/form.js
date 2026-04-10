import { Form, Input, Popover, Icon } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import { isEmail, isPhone } from 'utils/validate';
import { reduxForm, Field } from 'redux-form';
export const CREATE_TW_USER_FORM = 'CREATE_TW_USER_FORM';
import i18n from 'utils/i18n';
import { toJsRegExpMap } from 'utils/validate';
class CreateTwUser extends PureComponent {
  errorText = {
    Middle: i18n['general.password.middle.invalid.tw'],
    Strong: i18n['general.password.strong.invalid.tw'],
    SuperStrong: i18n['general.password.superstrong.invalid.tw']
  };
  render() {
    const { passwordStrength } = this.props;
    let backReg = passwordStrength.pwdRegexMap;
    let strengh = passwordStrength.pwdStrength;
    let regMap = toJsRegExpMap(backReg);
    let reg = regMap[strengh];
    const pwdReg = value => {
      return !reg.test(value) ? i18n['custom_field.password'] : undefined;
    };
    return (
      <Form>
        <Form.Item required col="2">
          <Form.Label>{i18n['tausermgmt.create_user.realname']}</Form.Label>
          <Form.Control>
            <Field name="realname" component={renderField} type="textField" />
          </Form.Control>
        </Form.Item>
        <Form.Item col="2">
          <Form.Label>
            {i18n['tausermgmt.create_user.newPwd']}
            <Popover
              trigger="hover"
              content={i18n['tausermgmt.create_user.newPwd.warn']}
            >
              <span>
                <Icon icon="question" className={`main-color`} />
              </span>
            </Popover>
          </Form.Label>
          <Form.Control>
            <Field
              placeholder={this.errorText[strengh]}
              name="newPwd"
              component={renderField}
              type="passwordField"
            />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="2">
          <Form.Label>{i18n['tausermgmt.create_user.phone']}</Form.Label>
          <Form.Control>
            <Field name="phone" component={renderField} type="phoneField" />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="2">
          <Form.Label>{i18n['tausermgmt.create_user.email']}</Form.Label>
          <Form.Control>
            <Field name="email" component={renderField} type="textField" />
          </Form.Control>
        </Form.Item>
        <Form.Item col="2">
          <Form.Control>
            <Field
              name="sendMessage"
              component={renderField}
              type="checkboxField"
              checkboxList={[
                {
                  label: i18n['tausermgmt.create_user.send_message'],
                  value: 'yes'
                }
              ]}
            />
          </Form.Control>
          <Form.Label>
            {i18n['tausermgmt.create_user.send_message.label']}
          </Form.Label>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: CREATE_TW_USER_FORM,
  enableReinitialize: true,
  validate: function(values, props) {
    const errors = {};
    const { passwordStrength } = props;
    let backReg = passwordStrength.pwdRegexMap;
    let strengh = passwordStrength.pwdStrength;
    let regMap = toJsRegExpMap(backReg);
    let reg = regMap[strengh];
    const pwdReg = value => {
      return !reg.test(value) ? i18n['custom_field.password'] : undefined;
    };
    if (!values.realname) {
      errors['realname'] = i18n['tausermgmt.create_user.require'];
    }
    if (!values.phone && !values.email) {
      errors['phone'] = i18n['tausermgmt.create_user.require'];
    }
    if (values.phone && values.phone.phone && !isPhone(values.phone.phone)) {
      errors['phone'] = i18n['tausermgmt.create_user.lint'];
    }
    if (values.email && !isEmail(values.email)) {
      errors['email'] = i18n['tausermgmt.create_user.lint'];
    }
    if (values.newPwd) {
      errors['newPwd'] = pwdReg(values.newPwd)
    }
    return errors;
  }
})(CreateTwUser);
