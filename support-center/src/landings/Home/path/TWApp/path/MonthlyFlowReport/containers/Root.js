import { connect } from 'react-redux';
import Root from '../components/Root';

import { 
  getMonthlyList
} from '../controls/actions';


export default connect(({
  monthlyflowreport: {
    monthlyList
  }
}) => ({
  monthlyList
}), {
  getMonthlyList
})(Root);