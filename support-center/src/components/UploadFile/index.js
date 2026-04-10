import { showTipsModal, showTopAlert } from 'common/actions';
import { connect } from 'react-redux';
import UploadFile from './UploadFile';


export default connect(null, {
  showTipsModal,
  showTopAlert,
})(UploadFile);
