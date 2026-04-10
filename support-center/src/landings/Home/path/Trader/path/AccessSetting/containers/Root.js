import { connect } from 'react-redux';
import Root from '../components/Root';
import { getAccessSetting, doServiceSetting, updateAccessSetting, sort, switchStatus } from '../../../controls/actions';
import { submit, reset } from 'redux-form';
import { showTopAlert } from 'common/actions';
export default connect(
  ({ traderCommon: { accessSetting }, common: { tenantInfo, versionRights } }) => ({
    accessSetting,
    tenantInfo,
    versionRights
  }),
  {
    getAccessSetting,
    submitForm: submit,
    reset,
    doServiceSetting,
    updateAccessSetting,
    showTopAlert,
    sort,
    switchStatus
  }
)(Root);
