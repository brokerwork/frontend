import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTipsModal, showTopAlert } from 'common/actions';
import {
  savePlatSetting,
  getPlatSetting,
  deleteAccountType,
  doSomeOperation,
  updatePayPlat,
  addRateSetting,
  deleteRateSetting,
  updateRateSetting,
  payPlatSettingSort,
  exchangeOrder,
  editOperation,
  getBrandInfo,
  savePlatformSetting,
  getFieldType,
  getPlatformSetting
} from '../../../controls/actions';
import { saveAccount } from '../controls/actions';
import { submit, reset } from 'redux-form';

export default connect(
  ({ common: { customPlatforms }, traderCommon: { paltSetting, brandInfo, platformSetting } }) => {
    return {
      customPlatforms,
      paltSetting,
      brandInfo,
      platformSetting
    };
  },
  {
    showTopAlert,
    showTipsModal,
    savePlatSetting,
    getPlatSetting,
    deleteAccountType,
    doSomeOperation,
    updatePayPlat,
    addRateSetting,
    deleteRateSetting,
    updateRateSetting,
    payPlatSettingSort,
    exchangeOrder,
    getBrandInfo,
    submitForm: submit,
    resetForm: reset,
    saveAccount,
    savePlatformSetting,
    getPlatformSetting,
    getFieldType
  }
)(Root);
