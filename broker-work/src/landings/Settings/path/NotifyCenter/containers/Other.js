import { connect } from 'react-redux';
import Other from '../components/Other';
import {
  getRoleOption,
  addRule,
  editRule,
  deleteRule
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { timeReport }, common }) => {
    return {
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch,
      roleOptions: timeReport.roleOptions
    };
  },
  {
    addRule,
    editRule,
    deleteRule,
    showTipsModal,
    showTopAlert,
    getRoleOption
  }
)(Other);
