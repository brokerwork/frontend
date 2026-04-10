import { connect } from 'react-redux';
import DownLoadTipsModal from '../components/DownLoadTipsModal';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

import {
  getServerList,
  updateCurrentServer,
  getPrivilegeType,
  updateCurrentPrivilegeType,
  getStatisticalReportType,
  updateCurrentStatisticalReportType,
  getReportList,
  updateDateRange,
  updateSearchType,
  updateSearchText,
  updateStatisticalListColumns,
  updateNeedRefresh,
  getSearchType,
  getDownLoadLink,
  updateCurrentSortParam,
  getSymbolGroup,
  updateCurrentSymbolType,
  getReportSubLevelUsers,
  updateCurrentStatisticalSubBelong,
  updatePagination,
  postDownloadRequest,
  getComissionSubLevelUsers,
  getEarningSubLevelUsers
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: {
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
        commission_list_columns,
        commission_report_list,
        object_type,
        current_object_type,
        commission_report_type,
        current_commission_report_type,
        current_commission_flag,
        searchFieldConditions,
        advancedLogicType
      }
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
      commissionReportList: commission_report_list,
      commissionListColumns: commission_list_columns,
      objectType: object_type,
      userRights: common.userRights,
      currentObjectType: current_object_type,
      commissionReportType: commission_report_type,
      currentCommissionReportType: current_commission_report_type,
      currentCommissionFlag: current_commission_flag,
      searchFieldConditions,
      advancedLogicType
    };
  },
  {
    getServerList,
    updateCurrentServer,
    getPrivilegeType,
    updateCurrentPrivilegeType,
    getStatisticalReportType,
    updateCurrentStatisticalReportType,
    getReportList,
    updateDateRange,
    updateCurrentSortParam,
    updateSearchType,
    updateSearchText,
    updateStatisticalListColumns,
    updateNeedRefresh,
    showTopAlert,
    getSearchType,
    getSymbolGroup,
    postDownloadRequest,
    getReportSubLevelUsers,
    getDownLoadLink,
    updateCurrentSymbolType,
    updateCurrentStatisticalSubBelong,
    updatePagination,
    showTipsModal,
    getComissionSubLevelUsers
  }
)(DownLoadTipsModal);
