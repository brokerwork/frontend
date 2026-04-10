import { connect } from 'react-redux';
import UpdateTrader from '../components/UpdateTrader';
import { submit } from 'redux-form';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { getGroup } from '../controls/actions';

export default connect(
  ({ settings: { timeReport }, common }) => {
    return {
      roleOptions: timeReport.roleOptions,
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch,
      serverGroup: timeReport.serverGroup
    };
  },
  {
    showTipsModal,
    showTopAlert,
    submitForm: submit,
    getGroup
  }
)(UpdateTrader);
