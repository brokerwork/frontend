import CustomField, { validate } from 'components/v2/CustomField';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';
import cs from '../../UpdateUserCard.less';
import { Checkbox, Form } from 'lean-ui';

export const USER_FORM_USER_INFO = 'USER_FORM_USER_INFO';

const initPasswordField = ({
  onCheck,
  input,
  disabled,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Checkbox
        onChange={onCheck.bind(this, input.onChange)}
        disabled={disabled}
      />
      <span>{i18n['usermgmt.usercard.init_password']}</span>
    </Form.Control>
  );
};
const sendEmailField = ({
  onCheck,
  defaultChecked,
  input,
  disabled,
  meta: { touched, error }
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  const isError = touched && error;
  return (
    <Form.Control errorMsg={isError ? error : null}>
      <Checkbox
        defaultChecked={defaultChecked || ''}
        onChange={onCheck.bind(this, input.onChange)}
        disabled={disabled}
      />
      <span>{i18n['usermgmt.usercard.send_email']}</span>
    </Form.Control>
  );
};
function fn() {}
class UserInfoForm extends PureComponent {
  changeInitPassword = (onChange, e) => {
    const v = e.target.checked;
    onChange(v);
  };

  changeSendEmail = (onChange, e) => {
    const v = e.target.checked;
    onChange(v);
  };
  render() {
    const {
      fields,
      fieldGenerator,
      initialValues,
      type,
      rights,
      disabled
    } = this.props;
    const setDefaultValue = !Boolean(Object.keys(initialValues).length);
    let editDisabled = (type !== 'add' && !rights.editBasicInfo) || disabled;
    return (
      <div>
        <CustomField
          fields={fields}
          setDefaultValue={setDefaultValue}
          fieldGenerator={fieldGenerator}
          disabled={disabled}
        />
        <Form>
          {type === 'add' ? (
            <Form.Item col={2}>
              <Form.Label required={false}>
                {i18n['usermgmt.usercard.inital_password']}
              </Form.Label>
              <Field
                name="needInitPass"
                onCheck={this.changeInitPassword}
                disabled={editDisabled}
                component={initPasswordField}
              />
            </Form.Item>
          ) : (
            undefined
          )}
          {type === 'add' ? (
            <Form.Item col={2}>
              <Form.Label required={false}>
                {i18n['usermgmt.usercard.send_email']}
              </Form.Label>
              <Field
                name="sendEmail"
                defaultChecked={true}
                disabled={editDisabled}
                onCheck={this.changeSendEmail}
                component={sendEmailField}
              />
            </Form.Item>
          ) : (
            undefined
          )}
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: USER_FORM_USER_INFO,
  validate,
  shouldValidate({ values = {}, nextProps, props }) {
    return true;
  },
  asyncValidate: (values, dispatch, props) => {
    const { type, initialValues } = props;

    if (type === 'edit' && values.email === initialValues.email)
      return Promise.resolve();

    if (!values.email) return Promise.resolve();
    //登录邮箱查重
    if (!props.userDisabled) {
      //如果用户已经创建，不再查邮箱重复
      return post({
        url: '/v1/user/exists',
        data: {
          key: 'email',
          value: values.email
        }
      }).then(({ result, data, mcode }) => {
        if (!result) {
          throw { email: i18n.mcode(mcode) };
        } else if (data) {
          throw { email: i18n['usermgmt.usercard.email_alert'] };
        }
      });
    } else {
      return Promise.resolve();
    }
  },
  asyncBlurFields: ['email'],
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
})(UserInfoForm);
