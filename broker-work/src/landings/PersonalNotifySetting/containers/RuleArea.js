import { connect } from 'react-redux';
import RuleArea from '../components/RuleArea';
import {
  getSubUserTree,
  getPersonalRule,
  setPersonalSwtich,
  setRulesettings
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  state => {
    const {
      common: { userRights },
      personalNotify: { personalReportSet, personalRules, systemSettings }
    } = state;

    return {
      userRights,
      personalReportSet,
      personalRules,
      systemSettings
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getSubUserTree,
    getPersonalRule,
    setPersonalSwtich,
    setRulesettings
  }
)(RuleArea);
