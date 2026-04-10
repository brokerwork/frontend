import { connect } from 'react-redux';
import Root from '../components/Root';
import { getThemeList } from '../controls/actions';
import { getBrandInfo } from '../../../controls/actions';

export default connect(
  ({ traderCommon: { brandInfo }, common: { versionRights } }) => ({
    brandInfo,
    versionRights
  }),
  {
    getBrandInfo,
    getThemeList
  }
)(Root);
