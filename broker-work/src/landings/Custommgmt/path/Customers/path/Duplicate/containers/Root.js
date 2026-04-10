import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import Root from '../components/Root';

export default connect(
  ({
    common,
    customMgmt: {
      trashes: {
        duplicatesList,
        customerColumns,
        selectedItemsMap,
        paginationInfo,
        searchType,
        fuzzySearchType,
        fuzzySearchText,
        customerDetailModalInfo,
        followWayOptions,
        advancedLogicType,
        searchFieldConditions,
        customerLinkSource,
        showCustomerCard,
        currentSortParam,
        searchDate,
        dateRange,
        currentCondition,
        currentSource,
        currentCustomerState
      }
    }
  }) => ({
    brandInfo: common.brandInfo,
    duplicatesList,
    customerColumns,
    selectedItemsMap,
    paginationInfo,
    searchType,
    fuzzySearchType,
    fuzzySearchText,
    customerDetailModalInfo,
    followWayOptions,
    advancedLogicType,
    searchFieldConditions,
    customerLinkSource,
    userRights: common.userRights,
    isShowCustomerCard: showCustomerCard,
    currentSortParam,
    searchDate,
    dateRange,
    currentCondition,
    currentSource,
    currentCustomerState
  }),
  {
    ...actions
  }
)(Root);
