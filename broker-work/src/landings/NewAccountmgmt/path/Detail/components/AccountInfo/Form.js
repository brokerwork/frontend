import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';

export const ACCOUNT_INFO_FORM = 'ACCOUNT_INFO_FORM';

class AccountInfoForm extends PureComponent {
  render() {
    const { fields, disabled, fieldGenerator, onFocus } = this.props;
    return (
      <CustomField
        fields={fields}
        disabled={disabled}
        fieldGenerator={fieldGenerator}
        newFormField
        pure
        onFocus={onFocus}
      />
    );
  }
}

export default reduxForm({
  form: ACCOUNT_INFO_FORM,
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
  enableReinitialize: true,
  validate: (values, props) => {
    const { checkboxList } = props;
    const errors = {};
    Object.keys(values).map(key => {
      const _value = values[key];
      if (checkboxList.includes(key) && Number(_value) === 0) {
        errors[key] = i18n['custom_field.checkbox_required'];
      }
    });
    return errors;
  },
  shouldValidate: () => true
})(AccountInfoForm);
