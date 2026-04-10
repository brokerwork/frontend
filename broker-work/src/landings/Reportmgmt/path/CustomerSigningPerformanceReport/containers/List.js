import { connect } from 'react-redux';
import List from '../components/List';
import { showTopAlert } from 'commonActions/actions';
import {
  modifyParams,
  getCustomerSigningList,
  getCustomerSigningDetailList,
  modifyInnerParams
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      customerSigningPerformanceReport: {
        customer_signing_list,
        params,
        innerParams
      },
      base: { current_need_refresh }
    },
    common
  }) => ({
    brandInfo: common.brandInfo,
    userRights: common.userRights,
    customerSigningReportList: customer_signing_list,
    params: params,
    innerParams: innerParams
  }),
  {
    showTopAlert,
    modifyParams,
    getCustomerSigningList,
    getCustomerSigningDetailList,
    modifyInnerParams
  }
)(List);
