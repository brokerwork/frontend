import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';

import { updatePagination } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      downloadCenter: { listUpdateTime, downloadList }
    },
    common: { brandInfo }
  }) => {
    return {
      listUpdateTime,
      downloadList,
      brandInfo
    };
  },
  {
    updatePagination
  }
)(ActionsBar);
