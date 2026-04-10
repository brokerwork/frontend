import { connect } from 'react-redux';
import Root from '../components/Root';
import * as actions from '../controls/actions';
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
    common: { versionRights },
    traderFormSetting: { fieldList, plats }
  }) => {
    return {
      brandInfo,
      paltSetting,
      leverageList,
      platformSetting,
      versionRights,
      accountTypeConfig,
      riskDescData,
      openDescData,
      sameAccountData,
      accountGroups,
      fieldList,
      plats
    };
  },
  {
    ...actions,
    submitForm: submit,
    showTopAlert
  }
)(Root);
