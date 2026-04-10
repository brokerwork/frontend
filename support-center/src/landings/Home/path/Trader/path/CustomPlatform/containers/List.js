import { connect } from 'react-redux';
import List from '../components/List';
import { getList } from '../controls/actions';

export default connect(
  ({ traderCustomPlatform: { list } }) => ({
    list
  }),
  {
    getList
  }
)(List);
