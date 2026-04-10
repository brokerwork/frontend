import { connect } from 'react-redux';
import DetailModal from '../components/DetailModal';

import {
  updateDetailListColumns,
  getDetailList,
  getInnerDetailList
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      statisticalReport: {
        detail_list_columns,
        detail_list,
        current_server,
        current_statistical_report_type,
        symbol_id,
        currentListDetailType
      }
    }
  }) => {
    return {
      currentServer: current_server,
      currentListDetailType: currentListDetailType,
      currentStatisticalReportType: current_statistical_report_type,
      detailListColumns: detail_list_columns,
      detailList: detail_list,
      symbolId: symbol_id
    };
  },
  {
    updateDetailListColumns,
    getDetailList,
    getInnerDetailList
  }
)(DetailModal);
