import Pdf from '../components/BatchActions/Pdf';
import { connect } from 'react-redux';
import { getExportInfo } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ accountManagement: { currentServer, list: { selectedAccountIds } } }) => ({
    selectedAccountIds,
    currentServer
  }),
  { getExportInfo, showTopAlert, showTipsModal }
)(Pdf);
