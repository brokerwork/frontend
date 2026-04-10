import { connect } from 'react-redux';
import AdvancedSearch from '../components/AdvancedSearch';
import { showTopAlert } from 'commonActions/actions';

import {
  getSymbolGroup,
  getMTGroupList,
  getUserGroupList,
  updateAdvancedLogicType,
  updateSelectedAdvancedSearchConditions,
  updateFieldConditions,
  getSearchField
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      server_list,
      current_server,
      privilege_type,
      current_privilege_type,
      statistical_report_type,
      current_statistical_report_type,
      date_range,
      account_query_item,
      account_query_value,
      statistical_list_columns,
      current_need_refresh,
      search_type,
      symbol_group,
      current_symbol_group,
      current_statistical_subBelong,
      current_pagination,
      currentSortParam,
      advancedSearchType,
      advancedLogicType,
      selectedAdvancedSearchConditions,
      advancedSearchConditions,
      searchFieldConditions,
      mtGroupList,
      userGroupList,
      serverSymbols
    }
  }) => {
    return {
      serverList: server_list,
      currentServer: current_server,
      privilegeType: privilege_type,
      currentPrivilegeType: current_privilege_type,
      statisticalReportType: statistical_report_type,
      currentStatisticalReportType: current_statistical_report_type,
      dateRanges: date_range,
      symbolGroup: symbol_group,
      accountQueryItem: account_query_item,
      accountQueryValue: account_query_value,
      statisticalListColumns: statistical_list_columns,
      currentNeedRefresh: current_need_refresh,
      searchType: search_type,
      currentSymbolGroup: current_symbol_group,
      currentStatisticalSubBelong: current_statistical_subBelong,
      currentPagination: current_pagination,
      currentSortParam,
      advancedSearchType,
      advancedLogicType,
      selectedAdvancedSearchConditions,
      searchFieldConditions,
      advancedSearchConditions,
      mtGroupList,
      userGroupList,
      serverSymbols
    };
  },
  {
    getMTGroupList,
    getUserGroupList,
    updateAdvancedLogicType,
    updateSelectedAdvancedSearchConditions,
    updateFieldConditions,
    showTopAlert,
    getSymbolGroup,
    getSearchField
  }
)(AdvancedSearch);
