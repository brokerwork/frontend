import { connect } from 'react-redux';
import AccountInfo from '../components/AccountInfo';
import {
  getFieldList
} from '../controls/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  getFieldList
})(AccountInfo);