import { connect } from 'react-redux';
import Detail from '../components/Detail';
import { showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';
import {
  getUserInfo,
  resetUserInfo,
  updateUserPassword,
  updateDepositStatus,
  updateLoginStatus,
  faReset,
  getAccessConf,
  getUsers,
  getServerList,
  simAccountBind,
  simAccountCheckBind
} from '../controls/actions';

export default connect(
  ({
    common: { userRights, versionRights },
    taUserMgmt: { params, userInfo, accessConfig, users, demoServerList }
  }) => ({
    params,
    userRights,
    userInfo,
    accessConfig,
    versionRights,
    users,
    demoServerList
  }),
  {
    getUserInfo,
    resetUserInfo,
    updateUserPassword,
    updateDepositStatus,
    updateLoginStatus,
    showTipsModal,
    faReset,
    getAccessConf,
    getUsers,
    getServerList,
    submitForm: submit,
    simAccountBind,
    simAccountCheckBind
  }
)(Detail);
