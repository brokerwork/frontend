import { connect } from 'react-redux';
import StatisticalReport from '../components/StatisticalReport';
import { showTopAlert } from 'commonActions/actions';
import {
  getDepositByUserId,
  updateCurrentServer,
  getReportList,
  updateDateRange,
  updateSearchText,
  updateSearchType,
  getSearchType,
  getServerList,
  updateNeedRefresh,
  updateCurrentSortParam,
  updatePagination,
  updateHeader,
  updateSelectedAdvancedSearchConditions,
  updateFieldConditions,
  updateAdvancedLogicType,
  updateCondition,
  getSearchField,
  getUserGroupList,
  getMTGroupList
} from '../controls/actions';

export default connect(
  ({
    common,
    usersetting: {
      agentDepositReport: {
        deposit_detail,
        account_query_item,
        account_query_value,
        current_server,
        server_list,
        date_range,
        current_pagination,
        current_need_refresh,
        report_list,
        currentSortParam,
        reportHeader,
        currentCondition,
        advancedLogicType,
        advancedSearchType,
        advancedSearchConditions,
        userGroupList,
        mtGroupList,
        search_type,
        searchFieldConditions
      }
    }
  }) => ({
    depositDetail: deposit_detail,
    brandInfo: common.brandInfo,
    userRights: common.userRights,
    accountQueryItem: account_query_item,
    accountQueryValue: account_query_value,
    currentServer: current_server,
    serverList: server_list,
    reportList: report_list,
    dateRanges: date_range,
    currentPagination: current_pagination,
    currentNeedRefresh: current_need_refresh,
    currentSortParam,
    reportHeader,
    currentCondition,
    advancedLogicType,
    advancedSearchType,
    advancedSearchConditions,
    userGroupList,
    mtGroupList,
    searchType: search_type,
    searchFieldConditions
  }),
  {
    showTopAlert,
    getDepositByUserId,
    updateFieldConditions,
    updateCurrentServer,
    getReportList,
    updateDateRange,
    updateSearchText,
    updateSearchType,
    getSearchType,
    getServerList,
    updateNeedRefresh,
    updateCurrentSortParam,
    updatePagination,
    updateHeader,
    getSearchField,
    getUserGroupList,
    getMTGroupList,
    updateCondition,
    updateAdvancedLogicType
  }
)(StatisticalReport);
