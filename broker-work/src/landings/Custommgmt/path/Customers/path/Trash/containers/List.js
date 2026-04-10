import { connect } from 'react-redux';
import List from '../components/List';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    common,
    customMgmt: {
      trashes: {
        customersList,
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
        customerStates,
        currentCustomerState
      }
    }
  }) => ({
    customersList,
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
    customerStates,
    currentCustomerState
  }),
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(List);
