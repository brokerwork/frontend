import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getColumns,
  sortList,
  enableColumn,
  editColumnTitle,
  editColumnBanners
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({ appContentColumn: { columns } }) => ({
    data: columns
  }),
  {
    enableColumn,
    sortList,
    getColumns,
    editColumnBanners,
    editColumnTitle,
    showTopAlert,
    showTipsModal
  }
)(Root);
