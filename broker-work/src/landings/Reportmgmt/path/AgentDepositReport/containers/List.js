import * as actions from '../../../controls/actions';
import { connect } from 'react-redux';
import List from '../components/List';
import { showTopAlert } from 'commonActions/actions';
import {
  getAgentDepositList,
  updateNeedRefresh,
  updatePagination
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      agentDepositReport: {
        report_list,
        current_pagination,
        account_query_item,
        account_query_value,
        current_need_refresh,
        agentDepositListcolumns
      }
    },
    common
  }) => ({
    accountQueryItem: account_query_item,
    accountQueryValue: account_query_value,
    agentdepositReportList: report_list,
    currentPagination: current_pagination,
    currentNeedRefresh: current_need_refresh,
    brandInfo: common.brandInfo,
    userRights: common.userRights,
    agentDepositListcolumns
  }),
  {
    showTopAlert,
    getAgentDepositList,
    updateNeedRefresh,
    updatePagination
  }
)(List);
