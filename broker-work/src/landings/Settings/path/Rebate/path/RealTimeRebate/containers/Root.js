import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTipsModal } from 'commonActions/actions';
import {
  getRealTimeStatus,
  enableRealTime,
  disableRealTime
} from '../controls/actions';

export default connect(
  ({
    settings: {
      rebate: {
        realTimeRebate: { realTimeStatus }
      }
    }
  }) => ({
    realTimeStatus
  }),
  {
    showTipsModal,
    getRealTimeStatus,
    enableRealTime,
    disableRealTime
  }
)(Root);
