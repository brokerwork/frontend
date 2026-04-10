import { connect } from 'react-redux';
import ImportantNotification from '../components/ImportantNotification';
import {
  addRule,
  editRule,
  deleteRule,
  switchMain,
  updateNotifyWay
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { timeReport }, common }) => {
    return {
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch
    };
  },
  {
    addRule,
    editRule,
    deleteRule,
    switchMain,
    updateNotifyWay,
    showTipsModal,
    showTopAlert
  }
)(ImportantNotification);
