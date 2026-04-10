import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import * as actions from '../controls/actions';
import { showTopAlert, saveFormSortColumns } from 'commonActions/actions';

export default connect(
  ({
    common,
    customMgmt: {
      customers: {
        searchType,
        fuzzySearchType,
        fuzzySearchText,
        isShowBatchActions,
        selectedItemsMap,
        customersList,
        customerColumns,
        paginationInfo,
        customerDetailModalInfo,
        searchTypes,
        searchFieldConditions,
        advancedLogicType,
        dateRange,
        searchDate,
        typesOptions,
        currentCondition,
        customerSearchSource,
        currentSource,
        currentSortParam,
        advancedSearchType,
        advancedSearchConditions,
        ownId,
        customerStates,
        currentCustomerState,
        listUpdateTime
      }
    }
  }) => {
    return {
      searchType,
      searchDate,
      dateRange,
      fuzzySearchType,
      fuzzySearchText,
      isShowBatchActions,
      selectedItemsMap,
      customersList,
      paginationInfo,
      customerDetailModalInfo,
      searchTypes,
      customerColumns,
      searchFieldConditions,
      advancedLogicType,
      userRights: common.userRights,
      typesOptions,
      currentCondition,
      customerSearchSource,
      currentSource,
      currentSortParam,
      advancedSearchType,
      advancedSearchConditions,
      ownId,
      customerStates,
      currentCustomerState,
      listUpdateTime
    };
  },
  {
    ...actions,
    showTopAlert,
    saveFormSortColumns
  }
)(ActionsBar);
