import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import { submit, reset } from 'redux-form';

import {
  addSource,
  modifySearchParams,
  getServerList,
  getSourceList,
  getList
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ runmgmt: { sourceSetting }, common: { userRights } }) => {
    return {
      searchParams: sourceSetting.searchParams,
      userRights
    };
  },
  {
    addSource,
    showTopAlert,
    showTipsModal,
    modifySearchParams,
    getServerList,
    getSourceList,
    submitForm: submit,
    resetForm: reset,
    getList
  }
)(ActionsBar);
