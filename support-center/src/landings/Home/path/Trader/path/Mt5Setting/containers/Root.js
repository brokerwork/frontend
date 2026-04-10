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
  payPlatSettingSort,
  deleteAccountType,
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
  saveSameAccountSettingData
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
      sameAccountData
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
    sameAccountData
  }),
  {
    getBrandInfo,
    getPlatSetting,
    savePlatSettingBonus,
    submitForm: submit,
    reset,
    getLeverageList,
    savePlatSetting,
    setDefaultRate,
    updateRateSetting,
    exchangeOrder,
    showTipsModal,
    doSomeOperation,
    updatePayPlat,
    addRateSetting,
    deleteRateSetting,
    payPlatSettingSort,
    deleteAccountType,
    showTopAlert,
    getRate,
    operateSync,
    getPlatformSetting,
    getFieldType,
    savePlatformSetting,
    getAccountTypeConfig,
    updateAccountTypeConfig,
    getRiskDescData,
    saveOpenAccountSettingData,
    getOpenDescData,
    getSameAccountSettingData,
    saveSameAccountSettingData
  }
)(Root);
