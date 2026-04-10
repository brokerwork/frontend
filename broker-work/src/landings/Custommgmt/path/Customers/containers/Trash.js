import { connect } from 'react-redux';
import Trash from '../components/Trash';
import * as actions from '../controls/actions';

export default connect(
  ({
    common,
    customMgmt: {
      customers: {
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
    currentCustomerState
  }),
  {
    ...actions
  }
)(Trash);
