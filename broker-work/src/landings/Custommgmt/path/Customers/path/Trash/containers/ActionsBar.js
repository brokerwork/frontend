import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    common,
    customMgmt: {
      trashes: {
        customersList,
        selectedItemsMap,
        currentSortParam,
        customerColumns,
        paginationInfo,
        dateRange,
        fuzzySearchType,
        fuzzySearchText,
        searchDate,
        customerStates,
        currentCustomerState,
        selectabledCustomerStateTypes
      }
    }
  }) => {
    return {
      customersList,
      selectedItemsMap,
      currentSortParam,
      customerColumns,
      paginationInfo,
      dateRange,
      fuzzySearchType,
      fuzzySearchText,
      searchDate,
      customerStates,
      currentCustomerState,
      selectabledCustomerStateTypes
    };
  },
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(ActionsBar);
