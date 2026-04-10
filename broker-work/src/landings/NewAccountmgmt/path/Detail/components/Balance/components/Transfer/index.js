import { reduxForm, getFormValues } from 'redux-form';

import TransferTasksForm from './form';
import { connect } from 'react-redux';
export const TRANSFER_TASKS_FORM =
  'ACCOUNT_DETAILS_BALANCE_TRANSFER_TASKS_FORM';

const TransferFormReduxForm = reduxForm({
  form: TRANSFER_TASKS_FORM,
  enableReinitialize: true
})(TransferTasksForm);

class TransferForm extends PureComponent {
  render() {
    return <TransferFormReduxForm {...this.props} />;
  }
}

export default connect(state => {
  return {
    formValues: getFormValues(TRANSFER_TASKS_FORM)(state)
  };
})(TransferForm);
