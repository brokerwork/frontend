import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getNotifySetting,
  getSystemSettings,
  getVasSwitch,
  getRoleOption
} from '../controls/actions';

export default connect(
  ({ settings: { timeReport }, common: { userRights } }) => {
    return {
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch,
      userRights
    };
  },
  {
    getNotifySetting,
    getSystemSettings,
    getVasSwitch,
    getRoleOption
  }
)(Root);
