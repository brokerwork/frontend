import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';

export const AGENT_APPLY_BASE_INFO_FORM = 'AGENT_APPLY_BASE_INFO_FORM';

class AgentApplyBaseInfoForm extends PureComponent {
  render() {
    const { fields, initialValues } = this.props;
    const setDefaultValue = Object.keys(initialValues).length === 0;

    return <CustomField fields={fields} setDefaultValue={setDefaultValue} />;
  }
}

export default reduxForm({
  form: AGENT_APPLY_BASE_INFO_FORM,
  enableReinitialize: true,
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
  validate,
  asyncValidate: (values = {}, dispatch, props, field) => {
    const { checkUserInfo } = props;

    if (!field) return Promise.resolve({});

    if (
      (field === 'email' && !values.email) ||
      (field === 'phones' &&
        (!values.phones || (values.phones && !values.phones.phone)))
    )
      return Promise.resolve(props.asyncErrors || {});

    return checkUserInfo({
      key: field === 'phones' ? 'phone' : field,
      value:
        field === 'phones'
          ? `${values.phones.countryCode}@-@${values.phones.phone}`
          : values.email
    }).then(res => {
      if (res.data) {
        throw {
          ...props.asyncErrors,
          [field]: (
            <span>
              <FormattedMessage
                id="agent.apply.validate.exsit"
                defaultMessage={i18n['agent.apply.validate.exsit']}
                values={{
                  name: props.fields.find(item => item.key === field).label
                }}
              />
            </span>
          )
        };
      } else {
        if (props.asyncErrors) {
          throw props.asyncErrors;
        }
      }
    });
  },
  asyncBlurFields: ['email', 'phones']
})(AgentApplyBaseInfoForm);
