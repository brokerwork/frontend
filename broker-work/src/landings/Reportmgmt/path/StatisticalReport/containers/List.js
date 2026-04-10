import { connect } from 'react-redux';
import List from '../components/List';

import { updateNeedRefresh } from '../../../controls/actions';

import {
  getReportList,
  modifyParams,
  updatePagination,
  updateCurrentSortParam,
  getDetailList,
  updateDetailListColumns,
  getDetailType,
  updateCurrentSymbolId
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      base: { current_need_refresh },
      statisticalReport: {
        report_list,
        current_server,
        statistical_list_columns,
        paginationInfo,
        searchParams,
        currentSortParam,
        current_statistical_report_type,
      }
    }
  }) => {
    return {
      currentServer: current_server,
      currentSortParam: currentSortParam,
      currentStatisticalReportType: current_statistical_report_type,
      statisticalListColumns: statistical_list_columns,
      currentNeedRefresh: current_need_refresh,
      reportList: report_list,
      paginationInfo,
      params: searchParams
    };
  },
  {
    getReportList,
    getDetailList,
    getDetailType,
    updateCurrentSortParam,
    updateDetailListColumns,
    updateNeedRefresh,
    updatePagination,
    modifyParams,
    updateCurrentSymbolId
  }
)(List);
