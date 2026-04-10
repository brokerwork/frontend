import { connect } from 'react-redux';
import List from '../components/List';

import { 
  getMonthlyList,
  getRechargePlatform,
  getExchangeRate,
  getMonthlyDetail
} from '../controls/actions';
import { 
  showTipsModal, 
  getTenantInfo 
} from 'common/actions';


export default connect(({
  monthlyflowreport: {
    monthlyList
  }
}) => ({
  monthlyList
}), {
  getMonthlyList,
  getRechargePlatform,
  getExchangeRate,
  showTipsModal, 
  getTenantInfo,
  getMonthlyDetail
})(List);