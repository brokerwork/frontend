import { connect } from 'react-redux';
import SendObjects from '../components/SendObjects';
import { getReceiverList } from '../controls/actions';
export default connect(
  ({ settings: { timeReport } }) => {
    return {
      receiverList: timeReport.receiverList
    };
  },
  {
    getReceiverList
  }
)(SendObjects);
