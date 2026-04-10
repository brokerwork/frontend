import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert } from 'commonActions/actions';
import { getSetting, getAuthState } from '../controls/actions';

export default connect(
  ({
    common,
    usersetting: {
      securitySetting: { settingDetail }
    }
  }) => ({
    versionRights: common.versionRights,
    settingDetail,
    brandInfo: common.brandInfo,
    userInfo: common.userInfo
  }),
  {
    showTopAlert,
    getSetting,
    getAuthState
  }
)(Root);
