import { connect } from 'react-redux';
import Root from '../components/Root';

import { editColumnBanners, getColumns } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ appContentBannerEdit: { columns } }) => ({
    columns: columns
  }),
  {
    showTopAlert,
    editColumnBanners,
    getColumns
  }
)(Root);
