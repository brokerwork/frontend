import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getPlatSetting,
  savePlatSettingBonus,
  getLeverageList,
  savePlatSetting,
  setDefaultRate,
  exchangeOrder,
  doSomeOperation,
  updatePayPlat,
  addRateSetting,
  deleteRateSetting,
  updateRateSetting,
  deleteAccountType,
  payPlatSettingSort,
  getPlatformSetting,
  getFieldType,
  savePlatformSetting
} from '../../../controls/actions';
import { submit, reset } from 'redux-form';
import { showTipsModal, showTopAlert } from 'common/actions';

export default connect(
  ({ traderCommon: { paltSetting, leverageList, platformSetting }, common: { versionRights } }) => ({
    paltSetting,
    leverageList,
    platformSetting,
    versionRights
  }),
  {
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
    deleteAccountType,
    doSomeOperation,
    updatePayPlat,
    addRateSetting,
    deleteRateSetting,
    payPlatSettingSort,
    showTopAlert,
    getPlatformSetting,
    getFieldType,
    savePlatformSetting
  }
)(Root);
