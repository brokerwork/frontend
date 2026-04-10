import { connect } from 'react-redux';
import UpdateNotification from '../components/UpdateNotification';
import { submit } from 'redux-form';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { timeReport }, common }) => {
    return {
      roleOptions: timeReport.roleOptions,
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch
    };
  },
  {
    showTipsModal,
    showTopAlert,
    submitForm: submit
  }
)(UpdateNotification);
