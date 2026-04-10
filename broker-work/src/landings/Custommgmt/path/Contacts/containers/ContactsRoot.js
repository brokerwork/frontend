import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import ContactsRoot from '../components/ContactsRoot';

export default connect(
  ({ common: { brandInfo } }) => ({
    brandInfo
  }),
  actions
)(ContactsRoot);
