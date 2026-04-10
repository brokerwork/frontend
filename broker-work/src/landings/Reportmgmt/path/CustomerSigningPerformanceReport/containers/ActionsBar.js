import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import { showTopAlert } from 'commonActions/actions';
import { modifyParams, getCustomerSigningList } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      customerSigningPerformanceReport: { searchTypes, params }
    },
    common: { brandInfo }
  }) => ({
    searchTypes: searchTypes,
    params: params,
    brandInfo
  }),
  {
    showTopAlert,
    modifyParams,
    getCustomerSigningList
  }
)(ActionsBar);
