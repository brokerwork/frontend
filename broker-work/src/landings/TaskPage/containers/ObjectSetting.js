import { connect } from 'react-redux';
import { submit } from 'redux-form';

import ObjectSetting from '../components/ObjectSetting';
import { showTopAlert } from 'commonActions/actions';
import {
  getDetails,
  modifyCategorysData,
  getStepData,
  saveStepData,
  initialTaskGroupMember,
  initialServerList,
  saveDataToServer,
  modifyObjectName,
  initialLeverageList,
  getCtraderForm,
  modifySendSMS,
  taskSyncGroup,
  getAccountFields
} from '../controls/ObjectSettingActions';

export default connect(
  ({ taskmgmt, taskmgmt: { setting } }) => ({
    taskType: taskmgmt.taskType,
    details: setting.details,
    stepData: setting.stepData,
    taskGroupMembers: setting.taskGroupMembers,
    serverList: setting.serverList,
    leverageList: setting.leverageList,
    cTraderFormFields: setting.cTraderFormFields,
    accountFields: setting.accountFields
  }),
  {
    getDetails,
    modifyCategorysData,
    getStepData,
    saveStepData,
    showTopAlert,
    initialTaskGroupMember,
    initialServerList,
    saveDataToServer,
    modifyObjectName,
    initialLeverageList,
    getCtraderForm,
    modifySendSMS,
    submitForm: submit,
    taskSyncGroup,
    getAccountFields
  }
)(ObjectSetting);
