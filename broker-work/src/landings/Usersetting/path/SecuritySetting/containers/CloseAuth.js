import { connect } from 'react-redux';
import CloseAuth from '../components/DoubleAuth/CloseAuth';
import { showTopAlert } from 'commonActions/actions';
import { closeAuth, getGoogle, getAuthState } from '../controls/actions';

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
    closeAuth,
    getGoogle,
    getAuthState
  }
)(CloseAuth);
