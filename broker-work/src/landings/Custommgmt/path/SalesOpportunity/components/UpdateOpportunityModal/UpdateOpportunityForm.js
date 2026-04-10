import CustomField, { validate } from 'components/CustomField';
import { reduxForm } from 'redux-form';
import cs from './UpdateOpportunityModal.less';

export const UPDATE_OPPORTUNITY_FORM = 'CUSTOMER_UPDATE_OPPORTUNITY_FORM';

class UpdateOpportunityForm extends PureComponent {
  render() {
    const { fields, disabled, fieldGenerator, newFormField } = this.props;

    return (
      <div className={cs['form']}>
        <CustomField
          fields={fields}
          disabled={disabled}
          fieldGenerator={fieldGenerator}
          newFormField={newFormField}
          pure
        />
      </div>
    );
  }
}

export default reduxForm({
  form: UPDATE_OPPORTUNITY_FORM,
  validate,
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
  enableReinitialize: true
})(UpdateOpportunityForm);
