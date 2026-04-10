import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import {
  getMessages,
  modifyParams,
  initialParams,
  resetData,
  selectItem
} from '../../../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    messages: {
      searchParams,
      selectedItem,
      typesOptions,
      paginationInfo,
      listUpdateTime
    }
  }) => ({
    searchParams,
    selectedItem,
    typesOptions,
    paginationInfo,
    listUpdateTime
  }),
  {
    getMessages,
    modifyParams,
    initialParams,
    resetData,
    selectItem,
    showTopAlert,
    showTipsModal
  }
)(ActionBar);
