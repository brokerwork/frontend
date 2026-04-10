import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
export const COMPANY_ACCOUNT_FORM = 'TRADER_CUSTOM_COMPANY_ACCOUNT_FORM';

import CompanyAccountForm from '../AccountForm';

const CompanyAccountReduxForm = reduxForm({
  form: COMPANY_ACCOUNT_FORM,
  enableReinitialize: true
})(CompanyAccountForm);

export default connect(state => {
  return {
    formValues: getFormValues(COMPANY_ACCOUNT_FORM)(state)
  };
})(CompanyAccountReduxForm);
