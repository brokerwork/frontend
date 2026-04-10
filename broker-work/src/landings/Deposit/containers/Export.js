import { connect } from 'react-redux';
import Export from '../components/Export';

export default connect(
  ({ deposit: { depositList } }) => ({
    depositList
  }),
  {}
)(Export);
