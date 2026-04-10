import { connect } from 'react-redux';
import Users from '../components/Users';

export default connect(({ common: { brandInfo } }) => {
  return {
    brandInfo
  };
}, {})(Users);
