import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Main from '../components/Root';
import {
  getPersonalReport,
  setPersonalReport,
  getPersonalRule,
  getSystemSettings
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  state => {
    const {
      common: { personalReportShow },
      personalNotify: { personalReportSet, personalRules }
    } = state;

    return {
      personalReportSet,
      personalRules,
      personalReportShow
    };
  },
  {
    getPersonalReport,
    setPersonalReport,
    showTopAlert,
    getPersonalRule,
    getSystemSettings
  }
)(Main);
