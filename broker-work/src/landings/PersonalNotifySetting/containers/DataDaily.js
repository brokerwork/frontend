import { connect } from 'react-redux';
import DataDaily from '../components/DataDaily';
import { getPersonalReport, setPersonalReport } from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  state => {
    const { personalNotify: { personalReportSet } } = state;

    return {
      personalReportSet
    };
  },
  {
    getPersonalReport,
    setPersonalReport,
    showTopAlert,
    showTipsModal
  }
)(DataDaily);
