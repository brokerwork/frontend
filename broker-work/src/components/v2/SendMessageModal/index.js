import { showTopAlert } from 'commonActions/actions';
import { connect } from 'react-redux';
import SendMessageModal from './SendMessageModal';

export default connect(null, {
  showTopAlert
})(SendMessageModal);
