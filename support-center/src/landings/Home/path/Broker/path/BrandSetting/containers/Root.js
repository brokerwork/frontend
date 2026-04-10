import { connect } from 'react-redux';
import Root from '../components/Root';
import { getReceiverList } from '../controls/actions';
import { getBrandInfo } from '../../../controls/actions';

export default connect(
  ({ brokerCommon: { brandInfo }, common: { versionRights } }) => ({
    brandInfo,
    versionRights
  }),
  {
    getBrandInfo,
    getReceiverList
  }
)(Root);
