import * as actions from '../../../controls/actions';
import { connect } from 'react-redux';
import CustomerSigningPerformanceRoot from '../components/CustomerSigningPerformanceRoot';
import { showTopAlert } from 'commonActions/actions';
import { refreshList, modifyParams } from '../controls/actions';

export default connect(
  ({
    reportManagement: { customerSigningPerformanceReport: { params } },
    common: { brandInfo }
  }) => ({
    brandInfo,
    params: params
  }),
  {
    showTopAlert,
    refreshList,
    modifyParams,
    ...actions
  }
)(CustomerSigningPerformanceRoot);
