import { connect } from 'react-redux';
import DetailModal from '../components/DetailModal';
import {
  modifyInnerParams,
  getCustomerSigningDetailList
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      customerSigningPerformanceReport: {
        searchTypes,
        params,
        customer_signing_detail_list,
        innerParams
      }
    },
    common: { brandInfo }
  }) => ({
    searchTypes: searchTypes,
    params: params,
    brandInfo,
    customerSigningReportDetail: customer_signing_detail_list,
    innerParams: innerParams
  }),
  {
    modifyInnerParams,
    getCustomerSigningDetailList
  }
)(DetailModal);
