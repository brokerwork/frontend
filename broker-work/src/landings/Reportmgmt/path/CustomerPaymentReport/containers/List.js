import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import List from '../components/List';

export default connect(
  ({
    reportManagement: {
      customerPayment: {
        tableTimeLine,
        reportList,
        reportSta,
        listLoadAndEmpty,
        params,
        currentPageInfo,
        billRefundViewKey
      }
    },
    common: { brandInfo }
  }) => ({
    tableTimeLine,
    reportList,
    reportSta,
    listLoadAndEmpty,
    brandInfo,
    params,
    currentPageInfo,
    billRefundViewKey
  }),
  {
    ...actions
  }
)(List);
