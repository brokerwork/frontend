import { connect } from 'react-redux';
import CustomReportList from '../components/List';
import { modifyPage, removeCustomReport, getCustomReportList } from '../controls/actions';
import { showTipsModal } from 'commonActions/actions';
export default connect(
  ({
    common,
    settings: {
      customReport: { customReportList, pageParam }
    }
  }) => {
    return {
      customReportList,
      pageParam
    };
  },
  {
    modifyPage,
    removeCustomReport,
    showTipsModal,
    getCustomReportList
  }
)(CustomReportList);
