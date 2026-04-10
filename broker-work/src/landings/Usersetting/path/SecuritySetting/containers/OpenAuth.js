import { connect } from 'react-redux';
import OpenAuth from '../components/DoubleAuth/OpenAuth';
import { showTopAlert } from 'commonActions/actions';
import { openAuth, getGoogle, getAuthState } from '../controls/actions';

export default connect(
  ({
    usersetting: {
      securitySetting: { settingDetail, googleInfo }
    }
  }) => ({
    settingDetail,
    googleInfo
  }),
  {
    showTopAlert,
    openAuth,
    getGoogle,
    getAuthState
  }
)(OpenAuth);
