
import { connect } from 'react-redux';
import List from '../components/List';
import { 
  getReportList
} from '../controls/actions';


export default connect(({
  common: {
    tenantInfo
  },
  dealerOperateReport: {
    reportList
  }
}) => ({
  tenantInfo,
  reportList
}), {
  getReportList
})(List);