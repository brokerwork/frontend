import { connect } from 'react-redux';
import List from '../components/List';
import * as actions from '../controls/actions';
import { showTopAlert, saveFormSortColumns } from 'commonActions/actions';

export default connect(
  ({
    common: { userRights },
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
        ownId,
        customerShowcolumns,
        currentCustomerState,
        customerStates,
        tenantType
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
    userRights,
    isShowCustomerCard: showCustomerCard,
    currentSortParam,
    searchDate,
    dateRange,
    currentCondition,
    currentSource,
    ownId,
    customerShowcolumns,
    currentCustomerState,
    customerStates,
    tenantType
  }),
  {
    ...actions,
    showTopAlert,
    saveFormSortColumns
  }
)(List);
