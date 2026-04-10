import IpInfoModal from './modal';
import { connect } from 'react-redux';
import { updateLoginIpInfo, getIpLocation } from 'commonActions/actions';
export default connect(
  ({ common }) => {
    return {
      loginIpInfo: common.loginIpInfo
    };
  },
  {
    updateLoginIpInfo,
    getIpLocation
  }
)(IpInfoModal);
