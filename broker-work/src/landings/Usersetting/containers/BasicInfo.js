import { connect } from 'react-redux';
import BasicInfo from '../components/BasicInfo';
import {
  getServerList,
  getRoleList,
  getUserList,
  getUserAgentFormColumns
} from '../controls/actions';
import { showTopAlert, updateUserInfo } from 'commonActions/actions';

export default connect(
  ({ common, usersetting: { base: { userAgentColumns } } }) => ({
    userInfo: common.userInfo,
    brandInfo: common.brandInfo,
    userRights: common.userRights,
    userAgentColumns: userAgentColumns
  }),
  {
    getServerList,
    getRoleList,
    getUserList,
    updateUserInfo,
    showTopAlert,
    getUserAgentFormColumns
  }
)(BasicInfo);
