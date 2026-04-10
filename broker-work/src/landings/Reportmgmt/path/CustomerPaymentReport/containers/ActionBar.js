import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';

export default connect(
  ({
    reportManagement: {
      customerPayment: {
        customerStateTypes,
        params,
        productList,
        reportTypes,
        timeUnits,
        fuzzyItemList,
        filterTypes,
        billRefundViewKey,
        billRefundViews
      }
    },
    common: { brandInfo }
  }) => ({
    customerStateTypes,
    productList,
    reportTypes,
    timeUnits,
    params,
    brandInfo,
    fuzzyItemList,
    filterTypes,
    billRefundViewKey,
    billRefundViews
  }),
  {
    ...actions
  }
)(ActionBar);
