import { connect } from 'react-redux';
import Root from '../components/OpenAccount/RealAccountSetting/List';
import { getFieldType } from '../controls/actions';

export default connect(
  ({ traderCommon: { fieldType, brandInfo } }) => ({
    fieldType
  }),
  { getFieldType }
)(Root);
