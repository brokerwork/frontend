import { showTopAlert } from 'commonActions/actions';
import { connect } from 'react-redux';
import SendMessageModal from './sendMessageModal';

export default connect(null, {
  showTopAlert
})(SendMessageModal);
