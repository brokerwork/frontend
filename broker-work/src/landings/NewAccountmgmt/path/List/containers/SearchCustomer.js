import SearchCustomer from '../components/SearchCustomer';
import { connect } from 'react-redux';
import { getTaUserByCustomerId } from '../controls/actions';

export default connect(
  ({
    accountManagement: { serverList, currentServer, list: { taUserInfo } }
  }) => ({
    serverList,
    currentServer,
    taUserInfo
  }),
  { getTaUserByCustomerId }
)(SearchCustomer);
