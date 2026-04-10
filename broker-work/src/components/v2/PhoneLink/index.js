import { connect } from 'react-redux';
import PhoneLink from './link';
import {
  showTipsModal,
  showTopAlert,
  phoneCallStart,
  phoneCallEnd
} from 'commonActions/actions';

export default connect(
  ({ common }) => {
    return { userRights: common.userRights };
  },
  {
    showTipsModal,
    showTopAlert,
    phoneCallStart,
    phoneCallEnd
  }
)(PhoneLink);
