import { connect } from 'react-redux';
import { change } from 'redux-form';
import ObjectSettingForm from '../components/ObjectSettingCtraderForm';
import {
  getCtraderForm,
  getCtraderUserGroup,
  getCtraderCurrencyByServerId
} from '../controls/ObjectSettingActions';
import { getObjectMembers } from '../controls/actions';

export default connect(
  ({ taskmgmt, taskmgmt: { setting } }) => ({
    cTraderFormFields: setting.cTraderFormFields,
    cTraderExtenalData: setting.cTraderExtenalData,
    serverList: setting.serverList.ct
  }),
  {
    getCtraderForm,
    getCtraderUserGroup,
    getCtraderCurrencyByServerId,
    changeFormField: change
  }
)(ObjectSettingForm);
