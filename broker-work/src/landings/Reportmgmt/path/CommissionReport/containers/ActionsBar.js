import { connect } from 'react-redux';
import CommissionActionBar from '../components/ActionsBar';
import { showTipsModal, setOrCancelUsual } from 'commonActions/actions';
import { updateNeedRefresh } from '../../../controls/actions';
import {
  getReportList,
  postDownloadRequest,
  rebateSearchDownloadRequest,
  updateSearchText,
  updateCurrentSortParam,
  updateFieldConditions,
  modifyParams,
  getSimpleUsers,
  checkFailNum,
  reComputedRebate
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: { current_need_refresh, currentSortParam },
      commissionReport: {
        report_list,
        listUpdateTime,
        server_list,
        object_type,
        current_commission_report_type,
        searchParams,
        account_query_value,
        currentDownloadOptions,
        failNum
      }
    }
  }) => {
    return {
      serverList: server_list,
      currentCommissionReportType: current_commission_report_type,
      accountQueryValue: account_query_value,
      currentNeedRefresh: current_need_refresh,
      commissionReportList: report_list,
      currentSortParam,
      userRights: common.userRights,
      listUpdateTime,
      objectType: object_type,
      params: searchParams,
      currentDownloadOptions: currentDownloadOptions,
      userInfo: common.userInfo,
      failNum,
      usualReportList: common.usualReportList,
      versionRights: common.versionRights
    };
  },
  {
    updateNeedRefresh,
    updateCurrentSortParam,
    updateSearchText,
    updateFieldConditions,
    getReportList,
    postDownloadRequest,
    showTipsModal,
    modifyParams,
    getSimpleUsers,
    checkFailNum,
    reComputedRebate,
    setOrCancelUsual,
    rebateSearchDownloadRequest
  }
)(CommissionActionBar);
