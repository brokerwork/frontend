import { reduxForm, getFormValues } from 'redux-form';

import CreateTasksForm from './form';
import { connect } from 'react-redux';
export const CREATE_TASKS_FORM = 'ACCOUNT_DETAILS_BALANCE_CREATE_TASKS_FORM';

const TaskFormReduxForm = reduxForm({
  form: CREATE_TASKS_FORM,
  enableReinitialize: true
})(CreateTasksForm);

class TaskForm extends PureComponent {
  render() {
    return <TaskFormReduxForm {...this.props} />;
  }
}

export default connect(state => {
  return {
    formValues: getFormValues(CREATE_TASKS_FORM)(state)
  };
})(TaskForm);
