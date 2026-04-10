import { reduxForm, getFormValues } from 'redux-form';

import AssetsAccountForm from '../AccountForm';
import { connect } from 'react-redux';

export const ASSETS_ACCOUNT_FORM = 'TRADER_CUSTOM_ASSETS_ACCOUNT_FORM';

const AssetsAccountReduxForm = reduxForm({
  form: ASSETS_ACCOUNT_FORM,
  enableReinitialize: true
})(AssetsAccountForm);

export default connect(state => {
  return {
    formValues: getFormValues(ASSETS_ACCOUNT_FORM)(state)
  };
})(AssetsAccountReduxForm);
