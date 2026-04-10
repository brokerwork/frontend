import { connect } from 'react-redux';
import LostCustomer from '../components/LostCustomer';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    common,
    customMgmt: { customers: { customerDetailInfo, tenantType } }
  }) => ({
    customerDetailInfo,
    tenantType,
    userRights: common.userRights
  }),
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(LostCustomer);
