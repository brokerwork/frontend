import { connect } from 'react-redux';
import Root from '../components/Root';
import { submit, reset } from 'redux-form';

import {
  getList,
  addSource,
  editSource,
  lockSource,
  unlockSource,
  modifySearchParams,
  isExpire
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ runmgmt: { sourceSetting } }) => {
    return {
      sourceList: sourceSetting.sourceList,
      searchParams: sourceSetting.searchParams,
      navigationInfo: sourceSetting.navigationInfo,
      expire: sourceSetting.expire
    };
  },
  {
    getList,
    addSource,
    editSource,
    lockSource,
    unlockSource,
    isExpire,
    showTopAlert,
    modifySearchParams,
    submitForm: submit,
    resetForm: reset
  }
)(Root);
