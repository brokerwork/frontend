import { connect } from 'react-redux';
import DetailModal from '../components/DetailModal';

import {
  updateDetailListColumns,
  getDetailList,
  getInnerDetailList
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: {
        detail_list_columns,
        detail_list,
        server_list,
        current_server,
        statistical_report_type,
        current_object_type,
        current_commission_report_type,
        current_statistical_report_type,
        date_range,
        current_privilege_type,
        symbol_id,
        currentListDetailType,
        innerDetailList,
        currentCommissionItemLogin,
        commission_list_columns
      }
    }
  }) => {
    return {
      serverList: server_list,
      brandInfo: common.brandInfo,
      innerDetailList: innerDetailList,
      currentServer: current_server,
      currentListDetailType: currentListDetailType,
      currentPrivilegeType: current_privilege_type,
      statisticalReportType: statistical_report_type,
      currentObjectType: current_object_type,
      currentStatisticalReportType: current_statistical_report_type,
      currentCommissionReportType: current_commission_report_type,
      dateRange: date_range,
      detailListColumns: detail_list_columns,
      detailList: detail_list,
      symbolId: symbol_id,
      currentCommissionItemLogin: currentCommissionItemLogin,
      commissionListColumns: commission_list_columns
    };
  },
  {
    updateDetailListColumns,
    getDetailList,
    getInnerDetailList
  }
)(DetailModal);
