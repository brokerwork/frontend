import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';

export const USER_FORM_AGENCT_INFO = 'USER_FORM_AGENCT_INFO';

class AgencyForm extends PureComponent {
  render() {
    let {
      initialValues,
      fields,
      onSubmit,
      onSubmitSuccess,
      disabled,
      onChange,
      asyncValidate
    } = this.props;
    return (
      <CustomField
        fields={fields}
        onSubmit={onSubmit}
        disabled={disabled}
        onSubmitSuccess={onSubmitSuccess}
        initialValues={initialValues}
        onChange={onChange}
        asyncValidate={asyncValidate}
      />
    );
  }
}

export default reduxForm({
  form: USER_FORM_AGENCT_INFO,
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
})(AgencyForm);
