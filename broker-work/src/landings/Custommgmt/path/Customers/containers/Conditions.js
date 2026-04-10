import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import * as actions from '../controls/actions';
import { showTopAlert, saveFormSortColumns } from 'commonActions/actions';

export default connect(
  ({
    common: { userRights },
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
        currentCustomerState
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
      userRights,
      typesOptions,
      currentCondition,
      customerSearchSource,
      currentSource,
      currentSortParam,
      advancedSearchType,
      advancedSearchConditions,
      ownId,
      customerStates,
      currentCustomerState
    };
  },
  {
    ...actions,
    showTopAlert,
    saveFormSortColumns
  }
)(Conditions);
