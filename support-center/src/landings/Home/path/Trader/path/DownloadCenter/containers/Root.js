import { connect } from 'react-redux';
import Root from '../components/Root';
import { getDownloadList } from '../controls/actions';
import { getBrandInfo } from '../../../controls/actions';

export default connect(
  null,
  { getDownloadList, getBrandInfo }
)(Root);
