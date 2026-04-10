import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';

export const CUSTOM_INFO_FORM = 'CUSTOM_INFO_FORM';
class CustomInfoForm extends PureComponent {
  render() {
    const {
      fields,
      ownerRelatedInfo: { customer },
      filteredRights,
      onFocus,
      userRights
    } = this.props;
    return (
      <div>
        {customer.value && filteredRights.show.baseInfo ? (
          <CustomField
            fields={fields}
            newFormField
            forceOneRow
            pure
            onFocus={onFocus}
            disabled={!userRights['CUSTOMER_MODIFY']}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default reduxForm({
  form: CUSTOM_INFO_FORM,
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
  shouldValidate: () => true,
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
  }
})(CustomInfoForm);
