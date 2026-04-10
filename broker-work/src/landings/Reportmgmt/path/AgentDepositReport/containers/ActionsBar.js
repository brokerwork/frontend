import { connect } from 'react-redux';
import AgentDepositActionBar from '../components/ActionsBar';
import { showTopAlert } from 'commonActions/actions';
import {
  getAgentDepositList,
  updateAgentDepositColumns,
  updateNeedRefresh,
  getSearchType,
  updateSearchText,
  updateSearchType
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      agentDepositReport: {
        report_list,
        current_pagination,
        account_query_item,
        account_query_value,
        search_type
      }
    },
    common: { brandInfo }
  }) => ({
    accountQueryItem: account_query_item,
    accountQueryValue: account_query_value,
    commissionReportList: report_list,
    currentPagination: current_pagination,
    brandInfo,
    searchType: search_type
  }),
  {
    showTopAlert,
    getAgentDepositList,
    updateAgentDepositColumns,
    updateNeedRefresh,
    getSearchType,
    updateSearchText,
    updateSearchType
  }
)(AgentDepositActionBar);
