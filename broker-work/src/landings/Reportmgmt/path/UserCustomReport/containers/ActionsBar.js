import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import { showTipsModal, getSimpleUserList } from 'commonActions/actions';

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
  updateSearchText,
  removeCustomReport
} from '../controls/actions';

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
      userCustomReportDetail: {
        reportList,
        listUpdateTime,
        server_list,
        advancedSearchType,
        searchParams,
        current_server,
        currentSortParam,
        searchKeywords,
        reportConfig
      }
    }
  }) => {
    return {
      serverList: server_list,
      symbolGroup: symbol_group,
      currentNeedRefresh: current_need_refresh,
      searchType: search_type,
      currentSymbolGroup: current_symbol_group,
      currentPagination: current_pagination,
      currentSortParam,
      searchFieldConditions,
      reportList,
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
      searchKeywords,
      reportConfig
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
    removeCustomReport,
    getSimpleUserList
  }
)(ActionsBar);
