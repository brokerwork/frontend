import { connect } from 'react-redux';
import OrderDetail from '../components/OrderDetail';

import { 
  getMonthlyDetail
} from '../controls/actions';
import { 
  showTipsModal
} from 'common/actions';


export default connect(({
  monthlyflowreport: {
    monthlyDeatail
  }
}) => ({
  monthlyDeatail
}), {
  showTipsModal,
  getMonthlyDetail
})(OrderDetail);