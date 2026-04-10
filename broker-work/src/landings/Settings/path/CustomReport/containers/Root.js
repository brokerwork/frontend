import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getCustomReportList,
  getSettleTime,
  setSettleTime
} from '../controls/actions';
export default connect(
  ({
    settings: {
      customReport: { customReportList, pageParam, settleTime }
    }
  }) => {
    return {
      customReportList,
      pageParam,
      settleTime
    };
  },
  {
    getCustomReportList,
    getSettleTime,
    setSettleTime
  }
)(Root);
