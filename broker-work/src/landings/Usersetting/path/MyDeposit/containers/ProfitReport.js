import { connect } from 'react-redux';
import ProfitReport from '../components/ProfitReport';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import {
  getDepositByUserId,
  updateFieldConditions,
  updateCurrentServer,
  getProfitList,
  updateDateRange,
  getStatus,
  updateStatus,
  updateNeedRefresh,
  retryProfit,
  updatePagination
} from '../controls/actions';

export default connect(
  ({
    common,
    usersetting: {
      agentDepositReport: {
        deposit_detail,
        date_range,
        current_pagination,
        current_need_refresh,
        profit_list,
        current_status
      }
    }
  }) => ({
    depositDetail: deposit_detail,
    brandInfo: common.brandInfo,
    userRights: common.userRights,
    reportList: profit_list,
    dateRanges: date_range,
    currentStatus: current_status,
    currentPagination: current_pagination,
    currentNeedRefresh: current_need_refresh
  }),
  {
    showTopAlert,
    getDepositByUserId,
    updateFieldConditions,
    updateCurrentServer,
    getProfitList,
    updateDateRange,
    getStatus,
    updateStatus,
    updateNeedRefresh,
    showTipsModal,
    retryProfit,
    updatePagination
  }
)(ProfitReport);
