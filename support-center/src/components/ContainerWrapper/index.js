import { connect } from 'react-redux';
import Container from './Container';
import { getTenantInfo, getVersionRights } from 'common/actions';

export default connect(
  null,
  {
    getTenantInfo,
    getVersionRights
  }
)(Container);
