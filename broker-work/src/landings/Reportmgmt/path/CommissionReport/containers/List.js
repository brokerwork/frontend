import { connect } from 'react-redux';
import CommissionList from '../components/List';
import { showTipsModal } from 'commonActions/actions';
import {
  getReportList,
  modifyParams,
  selectItem,
  selectedDepositRetry,
  selectedDepositDelete,
  updateCurrentSortParam,
  updatePagination
} from '../controls/actions';
import {
  updateNeedRefresh,
  getDetailList,
  updateDetailListColumns,
  getDetailType,
  updateDetailListLogin
} from '../../../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: { current_need_refresh },
      commissionReport: {
        report_list,
        server_list,
        current_server,
        commission_list_columns,
        paginationInfo,
        searchParams,
        object_type,
        current_commission_report_type,
        current_object_type,
        searchFieldConditions,
        selectedItems,
        currentSortParam
      }
    }
  }) => {
    return {
      currentSortParam: currentSortParam,
      serverList: server_list,
      currentServer: current_server,
      objectType: object_type,
      currentObjectType: current_object_type,
      currentCommissionReportType: current_commission_report_type,
      commissionListColumns: commission_list_columns,
      currentNeedRefresh: current_need_refresh,
      commissionReportList: report_list,
      userRights: common.userRights,
      paginationInfo,
      params: searchParams,
      searchFieldConditions,
      selectedItems
    };
  },
  {
    updateNeedRefresh,
    getDetailList,
    getDetailType,
    updateDetailListColumns,
    updateCurrentSortParam,
    updateDetailListLogin,
    getReportList,
    modifyParams,
    selectItem,
    selectedDepositRetry,
    selectedDepositDelete,
    showTipsModal,
    updatePagination
  }
)(CommissionList);
