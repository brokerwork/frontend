import { connect } from 'react-redux';
import DoubleAuth from '../components/DoubleAuth';
import { showTopAlert } from 'commonActions/actions';
import { getGoogle } from '../controls/actions';

export default connect(
  ({
    common,
    usersetting: {
      securitySetting: { settingDetail, googleInfo, authState }
    }
  }) => ({
    settingDetail,
    googleInfo,
    authState,
    brandInfo: common.brandInfo,
    userInfo: common.userInfo
  }),
  {
    showTopAlert,
    getGoogle
  }
)(DoubleAuth);
