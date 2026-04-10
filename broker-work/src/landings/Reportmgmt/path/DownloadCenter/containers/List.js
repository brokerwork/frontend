import { connect } from 'react-redux';
import List from '../components/List';
import { showTipsModal } from 'commonActions/actions';
import {
  updatePagination,
  getDownloadList,
  rebuildDownload,
  checkDownload,
  deletDownloads
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      downloadCenter: { current_pagination, downloadList }
    }
  }) => {
    return {
      currentPagination: current_pagination,
      downloadList
    };
  },
  {
    getDownloadList,
    rebuildDownload,
    checkDownload,
    updatePagination,
    showTipsModal,
    deletDownloads
  }
)(List);
