import { connect } from 'react-redux';
import UpdateRule from '../components/UpdateRule';
import {
  getSubUserTree,
  getPersonalRule,
  setRulesettings
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  state => {
    const {
      personalNotify: {
        personalReportSet,
        personalRules,
        subUserTree,
        systemSettings
      }
    } = state;

    return {
      personalReportSet,
      personalRules,
      subUserTree,
      systemSettings
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getSubUserTree,
    getPersonalRule,
    submitForm: submit,
    setRulesettings
  }
)(UpdateRule);
