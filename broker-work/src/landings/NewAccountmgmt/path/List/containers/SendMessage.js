import SendMessage from '../components/BatchActions/SendMessage';
import { connect } from 'react-redux';
import { sendMsgCheck } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      list: { selectedAccountIds }
    }
  }) => ({
    currentServer,
    selectedAccountIds
  }),
  { showTopAlert, showTipsModal, sendMsgCheck }
)(SendMessage);
