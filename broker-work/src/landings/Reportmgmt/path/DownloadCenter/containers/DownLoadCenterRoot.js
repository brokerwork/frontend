import { connect } from 'react-redux';
import DownloadCenterRoot from '../components/DownloadCenterRoot';

import { updatePagination } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      downloadCenter: { current_pagination }
    },
    common: { brandInfo }
  }) => {
    return {
      currentPagination: current_pagination,
      brandInfo
    };
  },
  {
    updatePagination
  }
)(DownloadCenterRoot);
