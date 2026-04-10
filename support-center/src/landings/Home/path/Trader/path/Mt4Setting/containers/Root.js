import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getBrandInfo,
  getPlatSetting,
  savePlatSettingBonus,
  getLeverageList,
  savePlatSetting,
  doSomeOperation,
  updatePayPlat,
  addRateSetting,
  deleteRateSetting,
  updateRateSetting,
  setDefaultRate,
  exchangeOrder,
  deleteAccountType,
  payPlatSettingSort,
  getRate,
  operateSync,
  getPlatformSetting,
  getFieldType,
  savePlatformSetting,
  getAccountTypeConfig,
  updateAccountTypeConfig,
  getRiskDescData,
  getOpenDescData,
  saveOpenAccountSettingData,
  getSameAccountSettingData,
  saveSameAccountSettingData,
  fetchUsers
} from '../../../controls/actions';
import { submit, reset } from 'redux-form';
import { showTipsModal, showTopAlert } from 'common/actions';

export default connect(
  ({
    traderCommon: {
      brandInfo,
      paltSetting,
      leverageList,
      platformSetting,
      accountTypeConfig,
      riskDescData,
      openDescData,
      sameAccountData,
      accountGroups
    },
    common: { versionRights }
  }) => ({
    brandInfo,
    paltSetting,
    leverageList,
    platformSetting,
    versionRights,
    accountTypeConfig,
    riskDescData,
    openDescData,
    sameAccountData,
    accountGroups
  }),
  {
    getBrandInfo,
    getPlatSetting,
    getPlatformSetting,
    savePlatformSetting,
    savePlatSettingBonus,
    submitForm: submit,
    reset,
    getLeverageList,
    savePlatSetting,
    doSomeOperation,
    updatePayPlat,
    addRateSetting,
    updateRateSetting,
    deleteRateSetting,
    setDefaultRate,
    exchangeOrder,
    showTipsModal,
    deleteAccountType,
    payPlatSettingSort,
    showTopAlert,
    getRate,
    operateSync,
    getFieldType,
    getAccountTypeConfig,
    updateAccountTypeConfig,
    getRiskDescData,
    saveOpenAccountSettingData,
    getOpenDescData,
    getSameAccountSettingData,
    saveSameAccountSettingData,
    fetchUsers
  }
)(Root);
