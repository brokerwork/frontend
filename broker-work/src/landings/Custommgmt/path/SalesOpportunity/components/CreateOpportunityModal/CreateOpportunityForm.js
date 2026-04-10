import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm } from 'redux-form';

export const CREATE_OPPORTUNITY_FORM = 'CUSTOMER_CREATE_OPPORTUNITY_FORM';

class CreateOpportunityForm extends PureComponent {
  render() {
    const { fields, disabled, fieldGenerator } = this.props;

    return (
      <div>
        <CustomField
          fields={fields}
          disabled={disabled}
          setDefaultValue={true}
          fieldGenerator={fieldGenerator}
        />
      </div>
    );
  }
}

export default reduxForm({
  form: CREATE_OPPORTUNITY_FORM,
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
  validate
})(CreateOpportunityForm);
