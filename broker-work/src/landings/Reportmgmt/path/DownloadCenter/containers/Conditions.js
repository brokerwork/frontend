import { connect } from 'react-redux';
import Conditions from '../components/Conditions';

export default connect(({ common }) => {
  return {
    userRights: common.userRights
  };
}, null)(Conditions);
