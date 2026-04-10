import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
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
        selectabledCustomerStateTypes,
        searchFieldConditions
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
      selectabledCustomerStateTypes,
      searchFieldConditions
    };
  },
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(Conditions);
