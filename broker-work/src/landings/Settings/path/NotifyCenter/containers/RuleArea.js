import { connect } from 'react-redux';
import RuleArea from '../components/RuleArea';
import {
  getRoleOption,
  addRule,
  editRule,
  deleteRule
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { timeReport }, common: { userRights } }) => {
    return {
      systemSettings: timeReport.systemSettings,
      vasSwitch: timeReport.vasSwitch,
      roleOptions: timeReport.roleOptions,
      userRights
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
)(RuleArea);
