import { connect } from 'react-redux';
import List from '../components/List';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
export default connect(
  ({
    common,
    customMgmt: {
      duplicates: {
        duplicatesList,
        paginationInfo,
        bindUsersId,
        usersInfo,
        fields
      }
    }
  }) => ({
    duplicatesList,
    paginationInfo,
    bindUsersId,
    usersInfo,
    fields
  }),
  {
    ...actions,
    showTopAlert
  }
)(List);
