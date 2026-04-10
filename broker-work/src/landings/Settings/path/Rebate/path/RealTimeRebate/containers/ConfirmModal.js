import { connect } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal';
import { showTipsModal } from 'commonActions/actions';
import {
  getRealTimeStatus,
  enableRealTime,
  disableRealTime
} from '../controls/actions';

export default connect(
  ({
    common,
    settings: {
      rebate: {
        realTimeRebate: { realTimeStatus }
      }
    }
  }) => ({
    realTimeStatus,
    userRights: common.userRights,
    brandInfo: common.brandInfo
  }),
  {
    showTipsModal,
    getRealTimeStatus,
    enableRealTime,
    disableRealTime
  }
)(ConfirmModal);
