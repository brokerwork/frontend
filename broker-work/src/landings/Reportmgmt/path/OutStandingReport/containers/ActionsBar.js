import { connect } from 'react-redux';
import OutstandingActionBar from '../components/ActionsBar';
import { showTipsModal, setOrCancelUsual } from 'commonActions/actions';
import { updateNeedRefresh } from '../../../controls/actions';
import {
  getUserLevel,
  postDownloadRequest,
  modifyParams
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: { current_need_refresh },
      outStandingReport: {
        listUpdateTime,
        outstanding_report_list,
        searchParams
      }
    }
  }) => {
    return {
      currentNeedRefresh: current_need_refresh,
      userRights: common.userRights,
      outStandingReportList: outstanding_report_list,
      listUpdateTime,
      params: searchParams,
      usualReportList: common.usualReportList
    };
  },
  {
    updateNeedRefresh,
    getUserLevel,
    postDownloadRequest,
    showTipsModal,
    modifyParams,
    setOrCancelUsual
  }
)(OutstandingActionBar);
