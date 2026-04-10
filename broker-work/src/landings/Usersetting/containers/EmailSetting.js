import { connect } from 'react-redux';
import EmailSetting from '../components/EmailSetting';
import { updateEmail } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ common }) => ({
    userInfo: common.userInfo,
    brandInfo: common.brandInfo
  }),
  {
    showTopAlert,
    updateEmail
  }
)(EmailSetting);
