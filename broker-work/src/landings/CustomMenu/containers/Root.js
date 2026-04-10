import { connect } from 'react-redux';
import Root from '../components/Root';
import { getMenuDetail } from '../controls/actions';

export default connect(
  ({ customMenu: { menuDetail } }) => ({
    menuDetail
  }),
  { getMenuDetail }
)(Root);
