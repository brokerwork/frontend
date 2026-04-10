import { connect } from 'react-redux';
import DataDaily from '../components/DataDaily';
import {
  getNotifySetting,
  saveNotifySetting,
  getSystemSettings,
  getReceiverList,
  updateNotifyWay
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { timeReport } }) => {
    return {
      vasSwitch: timeReport.vasSwitch,
      systemSettings: timeReport.systemSettings
    };
  },
  {
    getNotifySetting,
    saveNotifySetting,
    getReceiverList,
    getSystemSettings,
    updateNotifyWay,
    showTipsModal,
    showTopAlert
  }
)(DataDaily);
