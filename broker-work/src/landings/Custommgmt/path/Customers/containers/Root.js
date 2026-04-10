import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import Root from '../components/Root';

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
        currentCustomerState,
        ownId,
        tenantType
      }
    }
  }) => ({
    brandInfo: common.brandInfo,
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
    currentCustomerState,
    ownId,
    tenantType
  }),
  {
    ...actions
  }
)(Root);
