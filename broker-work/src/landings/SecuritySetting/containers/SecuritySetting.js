import { connect } from 'react-redux';
import SecuritySetting from '../components/SecuritySetting';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    common
  }) => ({
    versionRights: common.versionRights,
    brandInfo: common.brandInfo,
    userInfo: common.userInfo
  }),
  {
    showTopAlert
  }
)(SecuritySetting);
