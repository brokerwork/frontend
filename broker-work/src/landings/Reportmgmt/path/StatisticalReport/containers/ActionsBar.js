import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import { showTipsModal, setOrCancelUsual } from 'commonActions/actions';

import {
  updateDateRange,
  updateNeedRefresh,
  getSearchType,
  updateCurrentSortParam,
  getSymbolGroup,
  updatePagination,
  getSearchField,
  getUserGroupList,
  getMTGroupList,
  getServerSymbols,
  updateSelectedAdvancedSearchConditions,
  updateFieldConditions,
  updateAdvancedLogicType,
  updateCondition
} from '../../../controls/actions';

import {
  getServerList,
  updateCurrentServer,
  getReportList,
  modifyParams,
  postDownloadRequest,
  updateSearchText
} from '../controls/actions';
import { getSimpleUserList } from 'commonActions/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: {
        current_need_refresh,
        search_type,
        symbol_group,
        current_symbol_group,
        current_statistical_subBelong,
        current_pagination,
        searchFieldConditions,
        advancedLogicType,
        advancedSearchConditions,
        userGroupList,
        mtGroupList,
        serverSymbols,
        currentCondition
      },
      statisticalReport: {
        report_list,
        listUpdateTime,
        server_list,
        current_statistical_report_type,
        advancedSearchType,
        searchParams,
        account_query_value,
        current_server,
        currentSortParam,
        statistical_list_columns
      }
    }
  }) => {
    return {
      serverList: server_list,
      currentStatisticalReportType: current_statistical_report_type,
      symbolGroup: symbol_group,
      accountQueryValue: account_query_value,
      statisticalListColumns: statistical_list_columns,
      currentNeedRefresh: current_need_refresh,
      searchType: search_type,
      currentSymbolGroup: current_symbol_group,
      currentStatisticalSubBelong: current_statistical_subBelong,
      currentPagination: current_pagination,
      currentSortParam,
      searchFieldConditions,
      reportList: report_list,
      advancedLogicType,
      advancedSearchType,
      advancedSearchConditions,
      userRights: common.userRights,
      userGroupList,
      serverSymbols,
      mtGroupList,
      currentCondition,
      listUpdateTime,
      params: searchParams,
      currentServer: current_server,
      usualReportList: common.usualReportList
    };
  },
  {
    getServerList,
    updateCurrentServer,
    getReportList,
    updateDateRange,
    updateCurrentSortParam,
    updateSearchText,
    updateNeedRefresh,
    getSearchType,
    getSymbolGroup,
    updatePagination,
    getSearchField,
    getUserGroupList,
    getMTGroupList,
    getServerSymbols,
    updateSelectedAdvancedSearchConditions,
    updateFieldConditions,
    updateAdvancedLogicType,
    updateCondition,
    modifyParams,
    postDownloadRequest,
    showTipsModal,
    getSimpleUserList,
    setOrCancelUsual
  }
)(ActionsBar);
