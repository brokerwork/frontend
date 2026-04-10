import { connect } from 'react-redux';
import CustomerInfo from '../components/CustomerInfo';
import {
  getFieldList
} from '../controls/actions';


export default connect(null, {
  getFieldList
})(CustomerInfo);