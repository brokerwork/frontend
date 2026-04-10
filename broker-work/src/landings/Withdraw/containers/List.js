import { connect } from 'react-redux';
import List from '../components/List';
import { getApplications, updatePagination } from '../controls/actions';

export default connect(
  ({ withDraw: { applications, params } }) => ({
    applications,
    params
  }),
  {
    getApplications,
    updatePagination
  }
)(List);
