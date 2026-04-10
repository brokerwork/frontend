import { connect } from 'react-redux';
import UserInfo from '../components/UserInfo';
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
})(UserInfo);