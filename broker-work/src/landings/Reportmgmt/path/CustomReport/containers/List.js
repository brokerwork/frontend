import { connect } from 'react-redux';
import List from '../components/List';

import { updateNeedRefresh } from '../../../controls/actions';

import {
  modifyParams,
  updatePagination,
  updateCurrentSortParam,
  getReportList
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      base: { current_need_refresh },
      customReportDetail: {
        reportList,
        current_server,
        paginationInfo,
        searchParams,
        currentSortParam
      }
    }
  }) => {
    return {
      currentServer: current_server,
      currentSortParam,
      currentNeedRefresh: current_need_refresh,
      reportList,
      paginationInfo,
      params: searchParams
    };
  },
  {
    modifyParams,
    updatePagination,
    updateCurrentSortParam,
    getReportList
  }
)(List);
